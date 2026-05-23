"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { getTournament, joinTournament } from "@/lib/tournaments";
import UserAvatar from "@/components/UserAvatar";
import { getLeaderboard, subscribeMatches, subscribeUserPredictions, savePrediction } from "@/lib/firestore";
import { FIXTURE } from "@/lib/fixture";
import { Tournament, UserProfile, Match, Prediction, Phase } from "@/types";

// ── Fixture helpers ───────────────────────────────────────────────────────

const PHASE_LABELS: Record<Phase, string> = {
  group: "Grupos", round_of_32: "R32", round_of_16: "Octavos",
  quarterfinal: "Cuartos", semifinal: "Semis", third_place: "3°", final: "Final",
};
const PHASE_ORDER: Phase[] = ["group","round_of_32","round_of_16","quarterfinal","semifinal","third_place","final"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function Flag({ code }: { code: string }) {
  if (!code) return <span className="w-5 h-3.5 bg-gray-700 rounded inline-block flex-shrink-0" />;
  return <img src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} alt={code} className="w-5 h-3.5 object-cover rounded-sm inline-block flex-shrink-0" />;
}

function PredInput({ match, prediction, onSave, saving }: {
  match: Match; prediction?: Prediction;
  onSave: (id: string, h: number, a: number) => void; saving: boolean;
}) {
  const locked = new Date(match.date) <= new Date();
  const [home, setHome] = useState<number | "">(prediction?.homeScore ?? "");
  const [away, setAway] = useState<number | "">(prediction?.awayScore ?? "");

  useEffect(() => {
    if (prediction) { setHome(prediction.homeScore); setAway(prediction.awayScore); }
  }, [prediction]);

  if (match.homeScore !== null && match.awayScore !== null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-white">{match.homeScore} - {match.awayScore}</span>
        {prediction?.points !== null && prediction?.points !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${prediction.points > 0 ? "bg-yellow-400/20 text-yellow-400" : "bg-gray-800 text-gray-500"}`}>
            {prediction.points > 0 ? `+${prediction.points}` : "0"} pts
          </span>
        )}
      </div>
    );
  }
  if (locked) return (
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      {prediction ? <span className="font-mono">{prediction.homeScore} - {prediction.awayScore}</span> : <span className="italic text-xs">Sin prode</span>}
      <span className="text-xs">🔒</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <input type="number" min={0} max={20} value={home}
        onChange={(e) => setHome(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-9 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400" />
      <span className="text-gray-600">-</span>
      <input type="number" min={0} max={20} value={away}
        onChange={(e) => setAway(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-9 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400" />
      <button disabled={saving || home === "" || away === ""}
        onClick={() => onSave(match.id, Number(home), Number(away))}
        className="text-xs bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded hover:bg-yellow-300 disabled:opacity-40 transition-colors">
        {saving ? "..." : "OK"}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();

  const [tab, setTab] = useState<"tabla" | "fixture">("tabla");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fixture state
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState("A");

  const isMember = !!user && (tournament?.members.includes(user.uid) ?? false);

  useEffect(() => {
    async function load() {
      const t = await getTournament(id);
      if (!t) { router.push("/mis-predicciones"); return; }
      setTournament(t);
      if (user && t.members.includes(user.uid)) setCurrentTournament(t);

      const allUsers = await getLeaderboard();
      setMembers(
        allUsers.filter((u) => t.members.includes(u.uid))
          .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      );
      setLoading(false);
    }
    load();
  }, [id, user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserPredictions(user.uid, setPredictions);
    return unsub;
  }, [user]);

  async function handleJoin() {
    if (!user) { router.push(`/login?redirect=/torneos/${id}`); return; }
    setJoining(true);
    try {
      const t = await joinTournament(user.uid, id);
      await refreshTournaments();
      setCurrentTournament(t);
      setTournament(t);
      const allUsers = await getLeaderboard();
      setMembers(allUsers.filter((u) => t.members.includes(u.uid)).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al unirse");
    } finally {
      setJoining(false);
    }
  }

  async function handleSavePred(matchId: string, home: number, away: number) {
    if (!user) return;
    setSaving(matchId);
    try { await savePrediction(user.uid, matchId, home, away); }
    catch (err) { alert(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(null); }
  }

  function share() {
    if (!tournament) return;
    navigator.clipboard.writeText(
      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${tournament.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-400">Cargando...</div>
    </div>
  );
  if (!tournament) return null;

  const predMap = Object.fromEntries(predictions.map((p) => [p.matchId, p]));
  const allMatches: Match[] = matches.length > 0
    ? matches
    : (FIXTURE as Omit<Match, "homeScore" | "awayScore">[]).map((m) => ({ ...m, homeScore: null, awayScore: null }));
  const shownMatches = allMatches.filter((m) =>
    m.phase === activePhase && (activePhase !== "group" || m.group === activeGroup)
  );

  return (
    <div className="max-w-2xl mx-auto">

      {/* Banner unirse */}
      {!isMember && (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold">Te invitaron a <span className="text-yellow-400">{tournament.name}</span></p>
            <p className="text-gray-400 text-sm mt-0.5">Sumate para participar y completar tus prodes.</p>
          </div>
          <button onClick={handleJoin} disabled={joining}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-300 disabled:opacity-50 whitespace-nowrap text-sm">
            {joining ? "Uniéndose..." : user ? "Unirme" : "Iniciá sesión para unirte"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <Link href="/mis-predicciones" className="text-xs text-gray-500 hover:text-gray-300 transition-colors mb-1 inline-block">
            ← Mis Prodes
          </Link>
          <h1 className="text-xl font-bold text-white">{tournament.name}</h1>
          <p className="text-gray-500 text-sm">{tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"}</p>
        </div>
        <button onClick={share}
          className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-all mt-5 ${
            copied ? "border-yellow-400/50 text-yellow-400 bg-yellow-400/10" : "border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700"
          }`}>
          {copied ? (
            <span>✓ ¡Copiado!</span>
          ) : (
            <>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Invitar</span>
              <span className="font-mono text-xs text-yellow-400 tracking-widest">{tournament.id}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-5 mb-5 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {(["tabla", "fixture"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${
              tab === t
                ? "bg-yellow-400 text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}>
            {t === "tabla" ? "Tabla" : "Fixture"}
          </button>
        ))}
      </div>

      {/* ── TABLA ── */}
      {tab === "tabla" && (
        <div className="flex flex-col gap-2">
          {members.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-medium">Sin participantes aún</p>
              <p className="text-gray-600 text-sm mt-1">Compartí el código para que se unan</p>
            </div>
          )}
          {members.map((u, i) => {
            const isMe = user?.uid === u.uid;
            const pos = i + 1;
            const name = u.displayName || u.email || "Jugador";
            return (
              <div key={u.uid} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border ${
                isMe ? "bg-yellow-400/5 border-yellow-400/40" : "bg-gray-900 border-gray-800"
              }`}>
                {/* Posición */}
                <div className={`w-8 text-center font-bold flex-shrink-0 ${
                  pos === 1 ? "text-2xl" : "text-base text-gray-500"
                } ${pos === 1 ? "text-yellow-400" : pos === 2 ? "text-gray-300" : pos === 3 ? "text-amber-600" : ""}`}>
                  {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
                </div>

                {/* Avatar */}
                <UserAvatar uid={u.uid} photoURL={u.photoURL} size={36} />

                {/* Nombre + stats */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm flex items-center gap-1.5 flex-wrap">
                    {name}
                    {isMe && <span className="text-xs text-yellow-400 font-normal">(vos)</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                    <span>{u.predictionsCount || 0} prodes</span>
                    <span className="text-green-500/80">{u.exactCount || 0} exactos</span>
                  </div>
                </div>

                {/* Puntos */}
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-yellow-400 leading-none">{u.totalPoints || 0}</div>
                  <div className="text-xs text-gray-600 mt-0.5">pts</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── FIXTURE ── */}
      {tab === "fixture" && (
        <div>
          {!isMember && (
            <p className="text-gray-500 text-sm mb-4">Unite al torneo para guardar tus predicciones.</p>
          )}

          {/* Phase tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
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
            <div className="flex gap-1.5 flex-wrap mb-4">
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

          <div className="flex flex-col gap-2">
            {shownMatches.map((match) => (
              <div key={match.id} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Teams */}
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <span className="font-semibold text-sm text-white text-right">{match.homeTeam}</span>
                    <Flag code={match.homeFlagCode} />
                  </div>
                  <span className="text-gray-600 text-xs font-bold flex-shrink-0">vs</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <Flag code={match.awayFlagCode} />
                    <span className="font-semibold text-sm text-white">{match.awayTeam}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 text-right sm:w-36 flex-shrink-0">
                  {formatDate(match.date)}
                </div>

                {/* Prediction */}
                <div className="sm:w-40 flex justify-end flex-shrink-0">
                  {user && isMember ? (
                    <PredInput match={match} prediction={predMap[match.id]} onSave={handleSavePred} saving={saving === match.id} />
                  ) : match.homeScore !== null ? (
                    <span className="text-sm font-bold text-white">{match.homeScore} - {match.awayScore}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
