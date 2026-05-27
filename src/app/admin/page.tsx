"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeMatches, updateMatchResult, seedFixture, getAdminStats, AdminStats } from "@/lib/firestore";
import { Match } from "@/types";

function formatRelativeTime(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "ahora mismo";
  if (minutes === 1) return "hace 1 min";
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.floor(minutes / 60)}h`;
}

function MiniBarChart({ title, data }: { title: string; data?: { date: string; count: number }[] }) {
  if (!data) {
    return (
      <div>
        <div className="text-xs font-medium text-gray-500 mb-2">{title}</div>
        <div className="h-20 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div>
      <div className="text-xs font-medium text-gray-500 mb-2">{title}</div>
      <div className="flex items-end gap-[3px] h-20">
        {data.map(({ date, count }) => {
          const barPct = count > 0 ? Math.max((count / max) * 100, 12) : 0;
          const dayNum = new Date(date + "T12:00:00").getDate();
          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center gap-0.5 group"
              title={`${date}: ${count}`}
            >
              <span className="text-[9px] text-gray-400 h-3 leading-3">
                {count > 0 ? count : ""}
              </span>
              <div className="w-full flex-1 relative">
                <div
                  className={`absolute bottom-0 w-full rounded-t transition-all ${
                    count > 0 ? "bg-celeste-500 group-hover:bg-celeste-600" : "bg-gray-100"
                  }`}
                  style={{ height: count > 0 ? `${barPct}%` : "3px" }}
                />
              </div>
              <span className="text-[9px] text-gray-400 leading-none mt-0.5">{dayNum}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [scores, setScores] = useState<Record<string, { home: string; away: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsRefreshedAt, setStatsRefreshedAt] = useState<Date | null>(null);
  const [showFixture, setShowFixture] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.push("/");
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  useEffect(() => {
    if (isAdmin) handleRefreshStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (loading || !isAdmin) return null;

  async function handleRefreshStats() {
    setStatsLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
      setStatsRefreshedAt(new Date());
    } catch (e) {
      console.error("Error cargando stats:", e);
    } finally {
      setStatsLoading(false);
    }
  }

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

  const metricCards = [
    { label: "Torneos", value: stats?.totalTournaments },
    { label: "Usuarios", value: stats?.totalUsers },
    { label: "Predicciones", value: stats?.totalPredictions?.toLocaleString("es-AR") },
    {
      label: "Resultados",
      value: stats ? `${stats.matchesWithResults}/104` : undefined,
    },
  ];

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

      {/* Stats section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink-900 text-sm">Estadísticas</h2>
          <div className="flex items-center gap-3">
            {statsRefreshedAt && (
              <span className="text-xs text-gray-400">
                Actualizado {formatRelativeTime(statsRefreshedAt)}
              </span>
            )}
            <button
              onClick={handleRefreshStats}
              disabled={statsLoading}
              className="text-xs bg-gray-50 border border-gray-200 text-ink-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              {statsLoading ? "Actualizando..." : "↻ Actualizar"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {metricCards.map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-ink-900 tabular-nums">
                {value !== undefined ? (
                  value
                ) : (
                  <span className="inline-block w-10 h-7 bg-gray-200 rounded animate-pulse" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <MiniBarChart title="Torneos por día (últimos 14 días)" data={stats?.tournamentsByDay} />
          <MiniBarChart title="Usuarios por día (últimos 14 días)" data={stats?.usersByDay} />
        </div>
      </div>

      {/* Fixture section */}
      <div className="mb-3">
        <button
          onClick={() => setShowFixture((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-ink-900 hover:text-celeste-600 transition-colors"
        >
          <span className={`transition-transform ${showFixture ? "rotate-90" : ""}`}>▶</span>
          Cargar resultados de partidos
        </button>
      </div>

      {showFixture && (
        <>
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
      </>
      )}
    </div>
  );
}
