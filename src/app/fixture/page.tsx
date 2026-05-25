"use client";

import { useEffect, useState } from "react";
import { subscribeMatches } from "@/lib/firestore";
import { Match, Phase } from "@/types";
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
  "group", "round_of_32", "round_of_16", "quarterfinal", "semifinal", "third_place", "final",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function Flag({ code, size = "sm" }: { code: string; size?: "sm" | "xs" }) {
  const cls = size === "xs" ? "w-5 h-3.5" : "w-6 h-4";
  if (!code) return <span className={`${cls} bg-gray-200 rounded inline-block flex-shrink-0`} />;
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      className={`${cls} object-cover rounded-sm inline-block flex-shrink-0 ring-1 ring-black/5`}
    />
  );
}

interface TeamStats {
  team: string;
  flagCode: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
}

function computeStandings(source: Match[], group: string): TeamStats[] {
  const stats: Record<string, TeamStats> = {};

  const groupMatches = source.filter((m) => m.phase === "group" && m.group === group);

  for (const m of groupMatches) {
    if (!stats[m.homeTeam]) stats[m.homeTeam] = { team: m.homeTeam, flagCode: m.homeFlagCode, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 };
    if (!stats[m.awayTeam]) stats[m.awayTeam] = { team: m.awayTeam, flagCode: m.awayFlagCode, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 };

    if (m.homeScore === null || m.awayScore === null) continue;

    const h = stats[m.homeTeam];
    const a = stats[m.awayTeam];
    h.pj++; a.pj++;
    h.gf += m.homeScore; h.gc += m.awayScore;
    a.gf += m.awayScore; a.gc += m.homeScore;

    if (m.homeScore > m.awayScore) {
      h.g++; h.pts += 3; a.p++;
    } else if (m.homeScore < m.awayScore) {
      a.g++; a.pts += 3; h.p++;
    } else {
      h.e++; h.pts++; a.e++; a.pts++;
    }
  }

  return Object.values(stats).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if ((b.gf - b.gc) !== (a.gf - a.gc)) return (b.gf - b.gc) - (a.gf - a.gc);
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.team.localeCompare(b.team);
  });
}

function MatchRow({ match }: { match: Match }) {
  const played = match.homeScore !== null && match.awayScore !== null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-[var(--shadow-card)]">
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="font-semibold text-sm text-ink-900 text-right">{match.homeTeam}</span>
          <Flag code={match.homeFlagCode} />
        </div>
        <div className="flex-shrink-0 w-14 text-center">
          {played ? (
            <span className="font-bold text-ink-900 text-sm tabular-nums">{match.homeScore} – {match.awayScore}</span>
          ) : (
            <span className="text-gray-300 text-xs font-bold">vs</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Flag code={match.awayFlagCode} />
          <span className="font-semibold text-sm text-ink-900">{match.awayTeam}</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 text-right flex-shrink-0 hidden sm:block">
        <div>{formatDate(match.date)}</div>
        <div>{match.city}</div>
      </div>
    </div>
  );
}

function GroupStandings({ standings }: { standings: TeamStats[] }) {
  const cols = ["PJ", "G", "E", "P", "GF", "GC", "DG", "Pts"];
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-[var(--shadow-card)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/60">
            <th className="text-left pl-3 pr-1 py-2.5 text-xs font-semibold text-gray-400 w-5">#</th>
            <th className="text-left px-1 py-2.5 text-xs font-semibold text-gray-400">Equipo</th>
            {cols.map((c) => (
              <th key={c} className={`px-1.5 py-2.5 text-xs font-semibold text-center ${c === "Pts" ? "text-celeste-600" : "text-gray-400"}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((t, i) => {
            const dg = t.gf - t.gc;
            const qualified = i < 2;
            return (
              <tr key={t.team} className={`border-b border-gray-100 last:border-0 ${qualified ? "bg-celeste-50/60" : ""}`}>
                <td className="pl-3 pr-1 py-2.5">
                  <span className={`text-xs font-bold ${qualified ? "text-celeste-600" : "text-gray-300"}`}>{i + 1}</span>
                </td>
                <td className="px-1 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Flag code={t.flagCode} size="xs" />
                    <span className="font-medium text-ink-900 text-xs">{t.team}</span>
                  </div>
                </td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.pj}</td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.g}</td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.e}</td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.p}</td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.gf}</td>
                <td className="px-1.5 py-2.5 text-center text-xs text-gray-500 tabular-nums">{t.gc}</td>
                <td className={`px-1.5 py-2.5 text-center text-xs font-medium tabular-nums ${dg > 0 ? "text-emerald-600" : dg < 0 ? "text-red-500" : "text-gray-400"}`}>
                  {dg > 0 ? `+${dg}` : dg}
                </td>
                <td className="px-1.5 pr-3 py-2.5 text-center text-xs font-bold text-celeste-600 tabular-nums">{t.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function FixturePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState("A");

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  const source: Match[] = matches.length > 0
    ? matches
    : (FIXTURE as Omit<Match, "homeScore" | "awayScore">[]).map((m) => ({ ...m, homeScore: null, awayScore: null }));

  const shown = source.filter((m) =>
    m.phase === activePhase && (activePhase !== "group" || m.group === activeGroup)
  );

  const standings = activePhase === "group" ? computeStandings(source, activeGroup) : [];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900 mb-6">Fixture Mundial 2026</h1>

      {/* Phase tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {PHASE_ORDER.map((ph) => (
          <button key={ph} onClick={() => { setActivePhase(ph); if (ph === "group") setActiveGroup("A"); }}
            className={`text-xs px-3.5 py-2 rounded-full font-semibold transition-colors ${
              activePhase === ph ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30" : "bg-white border border-gray-200 text-gray-500 hover:border-celeste-300 hover:text-celeste-600"
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
              className={`w-9 h-9 rounded-lg font-bold text-sm transition-colors ${
                activeGroup === g ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30" : "bg-white border border-gray-200 text-gray-500 hover:border-celeste-300 hover:text-celeste-600"
              }`}>
              {g}
            </button>
          ))}
        </div>
      )}

      {activePhase === "group" ? (
        /* Desktop: partidos izquierda, tabla derecha. Mobile: tabla arriba, partidos abajo */
        <div className="flex flex-col lg:flex-row-reverse gap-4 items-start">

          {/* Tabla de posiciones — derecha en desktop, arriba en mobile */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <GroupStandings standings={standings} />
          </div>

          {/* Partidos */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {shown.map((match) => <MatchRow key={match.id} match={match} />)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((match) => <MatchRow key={match.id} match={match} />)}
        </div>
      )}
    </div>
  );
}
