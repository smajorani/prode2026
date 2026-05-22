"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function FlagEmoji({ code }: { code: string }) {
  if (!code) return <span className="w-6 h-4 bg-gray-700 rounded inline-block" />;
  // Usar flagcdn para banderas como imágenes
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className="w-6 h-4 object-cover rounded-sm inline-block"
    />
  );
}

interface PredictionInputProps {
  match: Match;
  prediction?: Prediction;
  onSave: (matchId: string, home: number, away: number) => void;
  saving: boolean;
}

function PredictionInput({ match, prediction, onSave, saving }: PredictionInputProps) {
  const locked = new Date(match.date) <= new Date();
  const [home, setHome] = useState(prediction?.homeScore ?? "");
  const [away, setAway] = useState(prediction?.awayScore ?? "");

  useEffect(() => {
    if (prediction) {
      setHome(prediction.homeScore);
      setAway(prediction.awayScore);
    }
  }, [prediction]);

  if (match.homeScore !== null && match.awayScore !== null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-white">{match.homeScore}</span>
        <span className="text-gray-500">-</span>
        <span className="font-bold text-white">{match.awayScore}</span>
        {prediction?.points !== undefined && prediction.points !== null && (
          <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
            +{prediction.points} pts
          </span>
        )}
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {prediction ? (
          <span>{prediction.homeScore} - {prediction.awayScore}</span>
        ) : (
          <span className="italic">Sin prode</span>
        )}
        <span className="text-xs">🔒</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        max={20}
        value={home}
        onChange={(e) => setHome(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-10 text-center bg-gray-800 border border-gray-600 rounded py-1 text-sm focus:outline-none focus:border-yellow-400"
      />
      <span className="text-gray-500">-</span>
      <input
        type="number"
        min={0}
        max={20}
        value={away}
        onChange={(e) => setAway(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-10 text-center bg-gray-800 border border-gray-600 rounded py-1 text-sm focus:outline-none focus:border-yellow-400"
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState<string>("A");

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
  const phases = PHASE_ORDER.filter((ph) =>
    matches.some((m) => m.phase === ph)
  );

  const groups = activePhase === "group"
    ? [...new Set(matches.filter((m) => m.phase === "group").map((m) => m.group!))].sort()
    : [];

  const displayedMatches = matches.filter((m) => {
    if (m.phase !== activePhase) return false;
    if (activePhase === "group") return m.group === activeGroup;
    return true;
  });

  // Si no hay datos de Firestore aún, mostrar el fixture estático
  const source = matches.length > 0 ? matches : (FIXTURE as Match[]).map((m) => ({ ...m, homeScore: null, awayScore: null }));
  const displayedStatic = source.filter((m) => {
    if (m.phase !== activePhase) return false;
    if (activePhase === "group") return m.group === activeGroup;
    return true;
  });

  const shown = matches.length > 0 ? displayedMatches : displayedStatic;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fixture Mundial 2026</h1>

      {/* Phase tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {phases.length > 0
          ? phases.map((ph) => (
              <button
                key={ph}
                onClick={() => { setActivePhase(ph); if (ph === "group") setActiveGroup("A"); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activePhase === ph
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {PHASE_LABELS[ph]}
              </button>
            ))
          : PHASE_ORDER.map((ph) => (
              <button
                key={ph}
                onClick={() => { setActivePhase(ph); if (ph === "group") setActiveGroup("A"); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activePhase === ph
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {PHASE_LABELS[ph]}
              </button>
            ))}
      </div>

      {/* Group tabs */}
      {activePhase === "group" && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {"ABCDEFGHIJKL".split("").map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`w-8 h-8 rounded font-bold text-sm transition-colors ${
                activeGroup === g
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {!user && (
        <p className="text-gray-400 text-sm mb-4 bg-gray-900 rounded-lg px-4 py-3 border border-gray-800">
          <a href="/login" className="text-yellow-400 underline">Iniciá sesión</a> para guardar tus predicciones.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {shown.map((match) => (
          <div
            key={match.id}
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
          >
            {/* Teams */}
            <div className="flex-1 flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 justify-end text-right">
                <span className="font-semibold text-sm">{match.homeTeam}</span>
                <FlagEmoji code={match.homeFlagCode} />
              </div>
              <span className="text-gray-500 text-xs font-bold">vs</span>
              <div className="flex items-center gap-2 flex-1 text-left">
                <FlagEmoji code={match.awayFlagCode} />
                <span className="font-semibold text-sm">{match.awayTeam}</span>
              </div>
            </div>

            {/* Date + venue */}
            <div className="text-xs text-gray-500 text-center sm:text-right sm:w-40">
              <div>{formatDate(match.date)}</div>
              <div className="truncate">{match.city}</div>
            </div>

            {/* Prediction */}
            <div className="sm:w-48 flex justify-start sm:justify-end">
              {user ? (
                <PredictionInput
                  match={match}
                  prediction={predMap[match.id]}
                  onSave={handleSave}
                  saving={saving === match.id}
                />
              ) : (
                match.homeScore !== null ? (
                  <span className="text-sm font-bold">{match.homeScore} - {match.awayScore}</span>
                ) : (
                  <span className="text-xs text-gray-600">Iniciá sesión</span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
