"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { subscribeMatches, subscribeUserPredictions, savePrediction } from "@/lib/firestore";
import { Match, Prediction, Phase } from "@/types";
import { FIXTURE } from "@/lib/fixture";

const PHASE_LABELS: Record<Phase, string> = {
  group: "Fase de Grupos",
  round_of_32: "Ronda de 32",
  round_of_16: "Octavos de Final",
  quarterfinal: "Cuartos de Final",
  semifinal: "Semifinales",
  third_place: "Tercer Puesto",
  final: "Final",
};

const PHASE_ORDER: Phase[] = [
  "group", "round_of_32", "round_of_16", "quarterfinal", "semifinal", "third_place", "final"
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function Flag({ code }: { code: string }) {
  if (!code) return <span className="w-6 h-4 bg-gray-700 rounded inline-block" />;
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className="w-6 h-4 object-cover rounded-sm inline-block flex-shrink-0"
    />
  );
}

interface PredInputProps {
  match: Match;
  prediction?: Prediction;
  onSave: (matchId: string, home: number, away: number) => void;
  saving: boolean;
  canPredict: boolean;
}

function PredInput({ match, prediction, onSave, saving, canPredict }: PredInputProps) {
  const locked = new Date(match.date) <= new Date();
  const [home, setHome] = useState<number | "">(prediction?.homeScore ?? "");
  const [away, setAway] = useState<number | "">(prediction?.awayScore ?? "");

  useEffect(() => {
    if (prediction) { setHome(prediction.homeScore); setAway(prediction.awayScore); }
  }, [prediction]);

  // Resultado oficial disponible
  if (match.homeScore !== null && match.awayScore !== null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-white">{match.homeScore} - {match.awayScore}</span>
        {prediction?.points !== null && prediction?.points !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            prediction.points > 0 ? "bg-yellow-400/20 text-yellow-400" : "bg-gray-800 text-gray-500"
          }`}>
            {prediction.points > 0 ? `+${prediction.points} pts` : "0 pts"}
          </span>
        )}
      </div>
    );
  }

  // Partido bloqueado (ya empezó)
  if (locked) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        {prediction ? (
          <span className="font-mono">{prediction.homeScore} - {prediction.awayScore}</span>
        ) : (
          <span className="italic text-xs">Sin prode</span>
        )}
        <span className="text-xs">🔒</span>
      </div>
    );
  }

  // Sin torneo
  if (!canPredict) return null;

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number" min={0} max={20}
        value={home}
        onChange={(e) => setHome(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-10 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400"
      />
      <span className="text-gray-600">-</span>
      <input
        type="number" min={0} max={20}
        value={away}
        onChange={(e) => setAway(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-10 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400"
      />
      <button
        disabled={saving || home === "" || away === ""}
        onClick={() => onSave(match.id, Number(home), Number(away))}
        className="text-xs bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded hover:bg-yellow-300 disabled:opacity-40 transition-colors"
      >
        {saving ? "..." : "Guardar"}
      </button>
    </div>
  );
}

export default function FixturePage() {
  const { user } = useAuth();
  const { currentTournament, tournaments } = useTournament();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState("A");

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserPredictions(user.uid, setPredictions);
    return unsub;
  }, [user]);

  async function handleSave(matchId: string, home: number, away: number) {
    if (!user) return;
    setSaving(matchId);
    try {
      await savePrediction(user.uid, matchId, home, away);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(null);
    }
  }

  const predMap = Object.fromEntries(predictions.map((p) => [p.matchId, p]));
  const source: Match[] = matches.length > 0
    ? matches
    : (FIXTURE as Omit<Match, "homeScore" | "awayScore">[]).map((m) => ({ ...m, homeScore: null, awayScore: null }));

  const shown = source.filter((m) =>
    m.phase === activePhase && (activePhase !== "group" || m.group === activeGroup)
  );

  const userInTournament = !!user && (tournaments.length > 0);
  const canPredict = userInTournament && !!currentTournament;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Fixture Mundial 2026</h1>
        {currentTournament && (
          <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-full font-medium">
            {currentTournament.name}
          </span>
        )}
      </div>

      {/* Gate: necesita torneo para predecir */}
      {user && !userInTournament && (
        <div className="bg-gray-900 border border-yellow-400/30 rounded-xl p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold">Para predecir necesitás unirte a un torneo</p>
            <p className="text-gray-400 text-sm mt-0.5">Creá uno o ingresá el código que te compartieron.</p>
          </div>
          <Link
            href="/torneos"
            className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm whitespace-nowrap"
          >
            Ir a Torneos
          </Link>
        </div>
      )}

      {!user && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 text-sm text-gray-400">
          <Link href="/login" className="text-yellow-400 underline">Iniciá sesión</Link> para guardar tus predicciones.
        </div>
      )}

      {/* Phase tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {PHASE_ORDER.map((ph) => (
          <button key={ph} onClick={() => { setActivePhase(ph); if (ph === "group") setActiveGroup("A"); }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              activePhase === ph ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}>
            {PHASE_LABELS[ph]}
          </button>
        ))}
      </div>

      {/* Group tabs */}
      {activePhase === "group" && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {"ABCDEFGHIJKL".split("").map((g) => (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`w-8 h-8 rounded font-bold text-sm transition-colors ${
                activeGroup === g ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}>
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {shown.map((match) => (
          <div key={match.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">

            {/* Equipos */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="font-semibold text-sm text-white text-right">{match.homeTeam}</span>
                <Flag code={match.homeFlagCode} />
              </div>
              <span className="text-gray-600 text-xs font-bold flex-shrink-0">vs</span>
              <div className="flex items-center gap-2 flex-1">
                <Flag code={match.awayFlagCode} />
                <span className="font-semibold text-sm text-white">{match.awayTeam}</span>
              </div>
            </div>

            {/* Fecha y sede */}
            <div className="text-xs text-gray-500 text-center sm:text-right sm:w-44 flex-shrink-0">
              <div>{formatDate(match.date)}</div>
              <div className="truncate">{match.city}</div>
            </div>

            {/* Predicción */}
            <div className="sm:w-52 flex justify-start sm:justify-end flex-shrink-0">
              {user ? (
                <PredInput
                  match={match}
                  prediction={predMap[match.id]}
                  onSave={handleSave}
                  saving={saving === match.id}
                  canPredict={canPredict}
                />
              ) : match.homeScore !== null ? (
                <span className="text-sm font-bold text-white">{match.homeScore} - {match.awayScore}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
