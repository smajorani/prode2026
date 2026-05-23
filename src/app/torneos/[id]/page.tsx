"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import {
  getTournament, joinTournament, isTournamentAdmin,
  updateTournamentInfo, removeMember, promoteToAdmin, demoteAdmin,
  subscribeTournament,
} from "@/lib/tournaments";
import UserAvatar from "@/components/UserAvatar";
import { subscribeLeaderboard, subscribeMatches, subscribeUserPredictions, savePrediction } from "@/lib/firestore";
import { FIXTURE } from "@/lib/fixture";
import { auth } from "@/lib/firebase";
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
        className="w-9 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <span className="text-gray-600">-</span>
      <input type="number" min={0} max={20} value={away}
        onChange={(e) => setAway(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-9 text-center bg-gray-800 border border-gray-700 rounded py-1 text-sm text-white focus:outline-none focus:border-yellow-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
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
  const { user, loading: authLoading, loginWithGoogle, registerWithEmail } = useAuth();
  const { setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();

  const [tab, setTab] = useState<"tabla" | "fixture" | "admin">("tabla");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Admin panel state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [memberAction, setMemberAction] = useState<string | null>(null);

  // Fixture state
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState("A");
  const [toast, setToast] = useState(false);

  // Modal bienvenida (usuarios no logueados)
  const [showModal, setShowModal] = useState(false);
  const [modalView, setModalView] = useState<"welcome" | "email">("welcome");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const isMember = !!user && (tournament?.members.includes(user.uid) ?? false);
  const isAdmin = !!user && !!tournament && isTournamentAdmin(tournament, user.uid);
  const autoJoinFired = useRef(false);

  const membersRef = useRef<string[]>([]);
  const allUsersRef = useRef<UserProfile[]>([]);

  useEffect(() => {
    function rebuild() {
      const ids = membersRef.current;
      setMembers(
        allUsersRef.current
          .filter((u) => ids.includes(u.uid))
          .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      );
    }

    const unsubTournament = subscribeTournament(id, (t) => {
      setTournament((prev) => {
        if (!prev) { setEditName(t.name); setEditDesc(t.description ?? ""); }
        return t;
      });
      const uid = auth.currentUser?.uid;
      if (uid && t.members.includes(uid)) setCurrentTournament(t);
      membersRef.current = t.members;
      rebuild();
      setLoading(false);
    });

    const unsubUsers = subscribeLeaderboard((users) => {
      allUsersRef.current = users;
      rebuild();
    });

    return () => { unsubTournament(); unsubUsers(); };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsub = subscribeMatches(setMatches);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserPredictions(user.uid, setPredictions);
    return unsub;
  }, [user]);

  // Mostrar modal después de 1 segundo si no hay sesión y el torneo cargó
  useEffect(() => {
    if (authLoading || user || loading) return;
    const t = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(t);
  }, [authLoading, user, loading]);

  // Auto-join: usuario logueado que no es miembro → unirse automáticamente
  useEffect(() => {
    if (!user || isMember || !tournament || loading || autoJoinFired.current) return;
    autoJoinFired.current = true;
    const timer = setTimeout(async () => {
      try {
        const t = await joinTournament(user.uid, id);
        await refreshTournaments();
        setCurrentTournament(t);
        setTournament(t);
        const allUsers = await getLeaderboard();
        setMembers(allUsers.filter((u) => t.members.includes(u.uid)).sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)));
      } catch { /* silent */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [user, isMember, tournament, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleGoogleAuth() {
    setRegError("");
    try {
      await loginWithGoogle();
      setShowModal(false);
    } catch {
      setRegError("No se pudo iniciar sesión con Google");
    }
  }

  async function handleEmailRegister() {
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError("Completá todos los campos"); return;
    }
    setRegLoading(true); setRegError("");
    try {
      await registerWithEmail(regEmail, regPassword, regName);
      setShowModal(false);
    } catch (e) {
      setRegError(e instanceof Error ? e.message : "Error al registrarse");
    } finally {
      setRegLoading(false);
    }
  }

  async function handleSavePred(matchId: string, home: number, away: number) {
    if (!user) return;
    setSaving(matchId);
    try {
      await savePrediction(user.uid, matchId, home, away);
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
    catch (err) { alert(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(null); }
  }

  async function handleSaveInfo() {
    if (!tournament) return;
    setAdminSaving(true);
    await updateTournamentInfo(tournament.id, { name: editName.trim(), description: editDesc.trim() });
    setTournament((t) => t ? { ...t, name: editName.trim(), description: editDesc.trim() } : t);
    setAdminSaving(false);
  }

  async function handleRemoveMember(uid: string) {
    if (!tournament) return;
    if (!confirm("¿Querés quitar a este usuario del torneo?")) return;
    setMemberAction(uid);
    await removeMember(tournament.id, uid);
    setTournament((t) => t ? { ...t, members: t.members.filter((m) => m !== uid), admins: (t.admins ?? []).filter((a) => a !== uid) } : t);
    setMembers((prev) => prev.filter((m) => m.uid !== uid));
    setMemberAction(null);
  }

  async function handlePromote(uid: string) {
    if (!tournament) return;
    setMemberAction(uid);
    await promoteToAdmin(tournament.id, uid);
    setTournament((t) => t ? { ...t, admins: [...(t.admins ?? []), uid] } : t);
    setMemberAction(null);
  }

  async function handleDemote(uid: string) {
    if (!tournament) return;
    setMemberAction(uid);
    await demoteAdmin(tournament.id, uid);
    setTournament((t) => t ? { ...t, admins: (t.admins ?? []).filter((a) => a !== uid) } : t);
    setMemberAction(null);
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

      {/* Toast */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Partido guardado
      </div>

      {/* Banner unirse */}
      {!isMember && user && (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sm text-white">Uniéndote a <span className="font-semibold text-yellow-400">{tournament.name}</span>...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <Link href="/mis-predicciones" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-colors mb-2 group">
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Mis torneos
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
      <div className="flex items-center gap-3 mt-5 mb-5">
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1">
          {(["tabla", "fixture"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === t ? "bg-yellow-400 text-gray-900 shadow-sm" : "text-gray-400 hover:text-white"
              }`}>
              {t === "tabla" ? "Tabla" : "Fixture"}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex bg-gray-800 border border-gray-700 rounded-xl p-1">
            <button
              onClick={() => setTab(tab === "admin" ? "tabla" : "admin")}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "admin" ? "bg-green-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
              }`}>
              ⚙ Admin
            </button>
          </div>
        )}
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
                    <span>{u.predictionsCount || 0} predicciones</span>
                    <span className="text-yellow-400/70">{u.partialCount || 0} parciales</span>
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

      {/* ── ADMIN ── */}
      {tab === "admin" && isAdmin && tournament && (
        <div className="flex flex-col gap-6">

          {/* Editar info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Información del torneo</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                {editingName ? (
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={40}
                      autoFocus
                      className="flex-1 bg-gray-800 border border-yellow-400 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <button onClick={() => setEditingName(false)} className="text-xs text-gray-500 hover:text-gray-300 px-2">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">{editName || tournament.name}</span>
                    <button onClick={() => setEditingName(true)} title="Editar nombre"
                      className="text-gray-600 hover:text-yellow-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Descripción (opcional)</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="Agregar descripción..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 resize-none"
                />
              </div>
              <button
                onClick={handleSaveInfo}
                disabled={adminSaving || !editName.trim()}
                className="self-end bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-lg text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
              >
                {adminSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>

          {/* Gestión de miembros */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              Participantes ({members.length})
            </h3>
            <div className="flex flex-col gap-2">
              {members.map((u) => {
                const isCreator = u.uid === tournament.createdBy;
                const isUAdmin = isTournamentAdmin(tournament, u.uid);
                const isMe = u.uid === user?.uid;
                const busy = memberAction === u.uid;
                const name = u.displayName || u.email || "Jugador";

                return (
                  <div key={u.uid} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                    <UserAvatar uid={u.uid} photoURL={u.photoURL} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium flex items-center gap-1.5 flex-wrap">
                        {name}
                        {isCreator && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">Creador</span>}
                        {!isCreator && isUAdmin && <span className="text-xs text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">Admin</span>}
                        {isMe && <span className="text-xs text-gray-500">(vos)</span>}
                      </div>
                      <div className="text-xs text-gray-600">{u.totalPoints || 0} pts</div>
                    </div>

                    {/* Acciones (no sobre el creador ni sobre uno mismo) */}
                    {!isCreator && !isMe && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        {isUAdmin ? (
                          <button
                            onClick={() => handleDemote(u.uid)}
                            disabled={busy}
                            className="text-xs border border-gray-700 text-gray-400 px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-40 transition-colors"
                          >
                            {busy ? "..." : "Quitar admin"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromote(u.uid)}
                            disabled={busy}
                            className="text-xs border border-blue-400/30 text-blue-400 px-2 py-1 rounded hover:bg-blue-400/10 disabled:opacity-40 transition-colors"
                          >
                            {busy ? "..." : "Hacer admin"}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(u.uid)}
                          disabled={busy}
                          className="text-xs border border-red-400/30 text-red-400 px-2 py-1 rounded hover:bg-red-400/10 disabled:opacity-40 transition-colors"
                        >
                          {busy ? "..." : "Quitar"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL BIENVENIDA (usuarios sin sesión) ── */}
      {showModal && !user && tournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-7 w-full max-w-sm shadow-2xl">

            {modalView === "welcome" ? (
              <>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Te invitaron a</p>
                <h2 className="text-2xl font-bold text-white mb-1">{tournament.name}</h2>
                <p className="text-sm text-gray-400 mb-7">
                  {tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"} · Registrate para predecir y competir.
                </p>

                {/* Google */}
                <button onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl mb-3 hover:bg-gray-100 transition-colors text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </button>

                {/* Email */}
                <button onClick={() => { setModalView("email"); setRegError(""); }}
                  className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl mb-5 hover:bg-yellow-300 transition-colors text-sm">
                  Registrarse con email
                </button>

                {regError && <p className="text-red-400 text-xs text-center mb-3">{regError}</p>}

                {/* Ya tengo cuenta */}
                <div className="text-center border-t border-gray-800 pt-4">
                  <button
                    onClick={() => router.push(`/login?redirect=/torneos/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Ya tengo cuenta · <span className="text-gray-300 font-medium">Ingresar</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => { setModalView("welcome"); setRegError(""); }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver
                </button>
                <h2 className="text-xl font-bold text-white mb-5">Crear cuenta</h2>

                <div className="flex flex-col gap-3 mb-4">
                  <input
                    placeholder="Tu nombre"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    autoFocus
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailRegister()}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {regError && <p className="text-red-400 text-xs mb-3">{regError}</p>}

                <button onClick={handleEmailRegister} disabled={regLoading}
                  className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl mb-4 hover:bg-yellow-300 disabled:opacity-50 transition-colors text-sm">
                  {regLoading ? "Creando cuenta..." : "Crear cuenta y unirme"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => router.push(`/login?redirect=/torneos/${id}`)}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Ya tengo cuenta · <span className="text-gray-300 font-medium">Ingresar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
