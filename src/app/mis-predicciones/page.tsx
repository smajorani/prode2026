"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeMatches, subscribeUserPredictions } from "@/lib/firestore";
import { Match, Prediction } from "@/types";
import { calculateScore } from "@/lib/scoring";

const REASON_LABELS = {
  exact: "Exacto",
  winner_and_diff: "Ganador + diferencia",
  winner_only: "Solo ganador",
  one_team_goals: "Goles de un equipo",
  miss: "Errado",
};

export default function MisPrediccionesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserPredictions(user.uid, setPredictions);
    return unsub;
  }, [user]);

  if (loading || !user) return null;

  const matchMap = Object.fromEntries(matches.map((m) => [m.id, m]));
  const sorted = [...predictions].sort((a, b) => {
    const ma = matchMap[a.matchId];
    const mb = matchMap[b.matchId];
    return (ma?.date ?? "").localeCompare(mb?.date ?? "");
  });

  const totalPoints = predictions.reduce((s, p) => s + (p.points ?? 0), 0);
  const played = predictions.filter((p) => p.points !== null).length;
  const exactCount = predictions.filter((p) => {
    const m = matchMap[p.matchId];
    if (!m) return false;
    const { reason } = calculateScore(m, p);
    return reason === "exact";
  }).length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Mis Predicciones</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
          <div className="text-xs text-gray-400 mt-0.5">Puntos totales</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{predictions.length}</div>
          <div className="text-xs text-gray-400 mt-0.5">Predicciones</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{exactCount}</div>
          <div className="text-xs text-gray-400 mt-0.5">Exactos</div>
        </div>
      </div>

      {sorted.length === 0 && (
        <p className="text-gray-400 text-sm">
          Todavía no hiciste ninguna predicción.{" "}
          <a href="/fixture" className="text-yellow-400 underline">Ir al fixture</a>
        </p>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((pred) => {
          const match = matchMap[pred.matchId];
          if (!match) return null;

          const played = match.homeScore !== null;
          const result = played ? calculateScore(match, pred) : null;

          return (
            <div
              key={pred.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-4"
            >
              {/* Teams */}
              <div className="flex-1 text-sm">
                <span className="font-semibold">{match.homeTeam}</span>
                <span className="text-gray-500 mx-2">vs</span>
                <span className="font-semibold">{match.awayTeam}</span>
              </div>

              {/* My prediction */}
              <div className="text-sm text-gray-300">
                Mi prode: <span className="font-bold">{pred.homeScore} - {pred.awayScore}</span>
              </div>

              {/* Real result */}
              {played && (
                <div className="text-sm text-gray-400">
                  Real: <span className="font-bold text-white">{match.homeScore} - {match.awayScore}</span>
                </div>
              )}

              {/* Points */}
              {result && (
                <div className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                  result.points > 0 ? "bg-yellow-400/20 text-yellow-400" : "bg-red-400/10 text-red-400"
                }`}>
                  {result.points > 0 ? `+${result.points}` : "0"} — {REASON_LABELS[result.reason]}
                </div>
              )}

              {!played && (
                <div className="text-xs text-gray-600">Pendiente</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
