"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeMatches, updateMatchResult, seedFixture } from "@/lib/firestore";
import { Match } from "@/types";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  if (loading || !isAdmin) return null;

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedFixture();
      alert("Fixture cargado en Firestore");
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSeeding(false);
    }
  }

  async function handleSaveResult(matchId: string) {
    const s = scores[matchId];
    if (!s || s.home === "" || s.away === "") return;
    setSaving(matchId);
    try {
      await updateMatchResult(matchId, Number(s.home), Number(s.away));
    } catch (e) {
      alert("Error: " + (e instanceof Error ? e.message : "desconocido"));
    } finally {
      setSaving(null);
    }
  }

  const filtered = matches.filter((m) =>
    `${m.homeTeam} ${m.awayTeam}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900">Panel Admin</h1>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="text-sm bg-white border border-gray-200 text-ink-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 disabled:opacity-50"
        >
          {seeding ? "Cargando..." : "Cargar fixture a Firestore"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar partido..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
      />

      <div className="flex flex-col gap-2">
        {filtered.map((match) => (
          <div
            key={match.id}
            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-[var(--shadow-card)]"
          >
            <div className="flex-1 text-sm font-semibold text-ink-900">
              {match.homeTeam} vs {match.awayTeam}
              <span className="ml-2 text-xs text-gray-400 font-normal">
                {new Date(match.date).toLocaleDateString("es-AR")} · {match.city}
              </span>
            </div>

            {match.homeScore !== null ? (
              <div className="text-sm text-emerald-600 font-bold">
                {match.homeScore} - {match.awayScore} ✓
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={30}
                  placeholder="0"
                  value={scores[match.id]?.home ?? ""}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, [match.id]: { home: e.target.value, away: s[match.id]?.away ?? "" } }))
                  }
                  className="w-12 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  placeholder="0"
                  value={scores[match.id]?.away ?? ""}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, [match.id]: { home: s[match.id]?.home ?? "", away: e.target.value } }))
                  }
                  className="w-12 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
                />
                <button
                  onClick={() => handleSaveResult(match.id)}
                  disabled={saving === match.id}
                  className="text-xs bg-celeste-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-celeste-600 disabled:opacity-40"
                >
                  {saving === match.id ? "..." : "Guardar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
