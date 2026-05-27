"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import {
  getTournament, joinTournament, isTournamentAdmin,
  updateTournamentInfo, removeMember, promoteToAdmin, demoteAdmin,
  subscribeTournament,
} from "@/lib/tournaments";
import UserAvatar from "@/components/UserAvatar";
import {
  subscribeLeaderboard, subscribeMatches, subscribeUserPredictions,
  savePrediction, deletePrediction, saveBonusPrediction, subscribeBonusPrediction,
} from "@/lib/firestore";
import { weightedRandomScore } from "@/lib/scores";
import { FIXTURE } from "@/lib/fixture";
import { SQUADS, ALL_TEAMS } from "@/lib/squads";
import { auth } from "@/lib/firebase";
import { Tournament, UserProfile, Match, Prediction, Phase, BonusPrediction } from "@/types";
import AdBanner from "@/components/AdBanner";

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
  if (!code) return <span className="w-5 h-3.5 bg-gray-200 rounded inline-block flex-shrink-0" />;
  return <img src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`} alt={code} className="w-5 h-3.5 object-cover rounded-sm inline-block flex-shrink-0 ring-1 ring-black/5" />;
}

function PredInput({ match, prediction, home, away, onChange }: {
  match: Match; prediction?: Prediction;
  home: number | ""; away: number | "";
  onChange: (id: string, h: number | "", a: number | "") => void;
}) {
  const locked = new Date(match.date) <= new Date();

  if (match.homeScore !== null && match.awayScore !== null) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-ink-900 tabular-nums">{match.homeScore} - {match.awayScore}</span>
        {prediction?.points !== null && prediction?.points !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${prediction.points > 0 ? "bg-celeste-50 text-celeste-700" : "bg-gray-100 text-gray-400"}`}>
            {prediction.points > 0 ? `+${prediction.points}` : "0"} pts
          </span>
        )}
      </div>
    );
  }
  if (locked) return (
    <div className="flex items-center gap-1.5 text-sm text-gray-400">
      {prediction ? <span className="font-mono tabular-nums">{prediction.homeScore} - {prediction.awayScore}</span> : <span className="italic text-xs">Sin prode</span>}
      <span className="text-xs">🔒</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <input type="number" min={0} max={20} value={home}
        onChange={(e) => onChange(match.id, e.target.value === "" ? "" : Number(e.target.value), away)}
        className="w-10 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <span className="text-gray-400">-</span>
      <input type="number" min={0} max={20} value={away}
        onChange={(e) => onChange(match.id, home, e.target.value === "" ? "" : Number(e.target.value))}
        className="w-10 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
    </div>
  );
}

// ── Bonus Panel ───────────────────────────────────────────────────────────

function TeamSelect({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 appearance-none pr-8"
      >
        <option value="">{placeholder}</option>
        {[...ALL_TEAMS].sort((a, b) => a.team.localeCompare(b.team, "es")).map(({ team }) => (
          <option key={team} value={team}>{team}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
    </div>
  );
}

function PlayerSelect({ team, value, onChange }: {
  team: string; value: string; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const squad = team ? SQUADS[team] : null;
  const hasPlayers = !!squad && (
    squad.porteros.length + squad.defensas.length +
    squad.mediocampistas.length + squad.delanteros.length > 0
  );
  const disabled = !team || !hasPlayers;
  const placeholder = !team ? "Elegí el equipo primero" : !hasPlayers ? "Plantel no disponible" : "Elegí un jugador";

  const sort = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b, "es"));
  const groups = squad && hasPlayers ? [
    { label: "Arqueros",       players: sort(squad.porteros) },
    { label: "Defensores",     players: sort(squad.defensas) },
    { label: "Mediocampistas", players: sort(squad.mediocampistas) },
    { label: "Delanteros",     players: sort(squad.delanteros) },
  ].filter((g) => g.players.length > 0) : [];

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          open ? "border-celeste-500 ring-2 ring-celeste-500/20" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={value ? "text-ink-900" : "text-gray-400"}>{value || placeholder}</span>
        <span className={`text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-[var(--shadow-pop)] overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {groups.map(({ label, players }) => (
              <div key={label}>
                <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-celeste-600 bg-gray-50 sticky top-0">
                  {label}
                </div>
                {players.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { onChange(p); setOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      value === p
                        ? "bg-celeste-50 text-celeste-700 font-medium"
                        : "text-ink-800 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BonusPanel({
  isMember, champion, tsTeam, tsPlayer, bpTeam, bpPlayer,
  onChampion, onTSTeam, onTSPlayer, onBPTeam, onBPPlayer, onSave, saving,
}: {
  isMember: boolean;
  champion: string; tsTeam: string; tsPlayer: string; bpTeam: string; bpPlayer: string;
  onChampion: (v: string) => void; onTSTeam: (v: string) => void; onTSPlayer: (v: string) => void;
  onBPTeam: (v: string) => void; onBPPlayer: (v: string) => void;
  onSave: () => void; saving: boolean;
}) {
  const championSquad = champion ? SQUADS[champion] : null;

  return (
    <div className="flex flex-col gap-4">
      {!isMember && (
        <p className="text-gray-500 text-sm">Unite al torneo para guardar tus predicciones bonus.</p>
      )}

      {/* Scoring legend */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 flex flex-wrap gap-x-5 gap-y-1">
        <span><span className="text-celeste-600 font-semibold">Campeón exacto</span> → 20 pts</span>
        <span><span className="text-celeste-600 font-semibold">Jugador exacto</span> → 15 pts</span>
        <span><span className="text-ink-800 font-semibold">Solo el equipo</span> → 8 pts</span>
      </div>

      {/* Campeón */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏆</span>
          <div>
            <div className="font-semibold text-ink-900 text-sm">Campeón del Mundial</div>
            <div className="text-xs text-gray-500">20 puntos si acertás</div>
          </div>
          {champion && championSquad && (
            <img
              src={`https://flagcdn.com/w40/${championSquad.flagCode.toLowerCase()}.png`}
              alt={champion}
              className="w-6 h-4 object-cover rounded-sm ml-auto ring-1 ring-black/5"
            />
          )}
        </div>
        <TeamSelect value={champion} onChange={onChampion} placeholder="Elegí el campeón" />
      </div>

      {/* Goleador */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⚽</span>
          <div>
            <div className="font-semibold text-ink-900 text-sm">Goleador del torneo</div>
            <div className="text-xs text-gray-500">15 pts jugador · 8 pts solo el equipo</div>
          </div>
          {tsTeam && SQUADS[tsTeam] && (
            <img
              src={`https://flagcdn.com/w40/${SQUADS[tsTeam].flagCode.toLowerCase()}.png`}
              alt={tsTeam}
              className="w-6 h-4 object-cover rounded-sm ml-auto ring-1 ring-black/5"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <TeamSelect value={tsTeam} onChange={onTSTeam} placeholder="Equipo del goleador" />
          <PlayerSelect team={tsTeam} value={tsPlayer} onChange={onTSPlayer} />
        </div>
      </div>

      {/* Mejor jugador */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">⭐</span>
          <div>
            <div className="font-semibold text-ink-900 text-sm">Mejor jugador del torneo</div>
            <div className="text-xs text-gray-500">15 pts jugador · 8 pts solo el equipo</div>
          </div>
          {bpTeam && SQUADS[bpTeam] && (
            <img
              src={`https://flagcdn.com/w40/${SQUADS[bpTeam].flagCode.toLowerCase()}.png`}
              alt={bpTeam}
              className="w-6 h-4 object-cover rounded-sm ml-auto ring-1 ring-black/5"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <TeamSelect value={bpTeam} onChange={onBPTeam} placeholder="Equipo del mejor jugador" />
          <PlayerSelect team={bpTeam} value={bpPlayer} onChange={onBPPlayer} />
        </div>
      </div>

      {isMember && (
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full bg-celeste-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50 transition-colors shadow-sm shadow-celeste-500/30"
        >
          {saving ? "Guardando..." : "Guardar Bonus"}
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading, loginWithGoogle, registerWithEmail } = useAuth();
  const { setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInviteLink = searchParams.get("action") === "invite";

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
  const [saving, setSaving] = useState(false);
  const [localEdits, setLocalEdits] = useState<Record<string, { home: number | ""; away: number | "" }>>({});
  const [activePhase, setActivePhase] = useState<Phase>("group");
  const [activeGroup, setActiveGroup] = useState("A"); // "A"–"L" or "BONUS"
  const [toast, setToast] = useState(false);
  const [randomFilling, setRandomFilling] = useState(false);

  // Bonus predictions state
  const [bonusPred, setBonusPred] = useState<BonusPrediction | null>(null);
  const [bonusSaving, setBonusSaving] = useState(false);
  const [bonusToast, setBonusToast] = useState(false);
  const [bonusChampion, setBonusChampion] = useState("");
  const [bonusTSTeam, setBonusTSTeam] = useState("");
  const [bonusTSPlayer, setBonusTSPlayer] = useState("");
  const [bonusBPTeam, setBonusBPTeam] = useState("");
  const [bonusBPPlayer, setBonusBPPlayer] = useState("");

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
          .sort((a, b) => {
            const pts = (b.totalPoints || 0) - (a.totalPoints || 0);
            if (pts !== 0) return pts;
            const ex = (b.exactCount || 0) - (a.exactCount || 0);
            if (ex !== 0) return ex;
            const pa = (b.partialCount || 0) - (a.partialCount || 0);
            if (pa !== 0) return pa;
            return (a.displayName || "").localeCompare(b.displayName || "");
          })
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

  useEffect(() => {
    if (!user || !id) return;
    const unsub = subscribeBonusPrediction(user.uid, id, (pred) => {
      setBonusPred(pred);
      if (pred) {
        setBonusChampion(pred.champion || "");
        setBonusTSTeam(pred.topScorerTeam || "");
        setBonusTSPlayer(pred.topScorerPlayer || "");
        setBonusBPTeam(pred.bestPlayerTeam || "");
        setBonusBPPlayer(pred.bestPlayerPlayer || "");
      }
    });
    return unsub;
  }, [user, id]);

  // Mostrar modal después de 1 segundo si no hay sesión y el torneo cargó
  useEffect(() => {
    if (authLoading || user || loading) return;
    const t = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(t);
  }, [authLoading, user, loading]);

  // Acceso: si no sos miembro y no venís con ?action=invite → redirigir
  useEffect(() => {
    if (authLoading || loading || !tournament) return;
    if (!user && !isInviteLink) { router.push("/login"); return; }
    if (user && !isMember && !isInviteLink) { router.push("/mis-predicciones"); }
  }, [authLoading, loading, user, isMember, isInviteLink, tournament]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-join: solo si llegó por el link de invitación (?action=invite)
  useEffect(() => {
    if (!user || isMember || !tournament || loading || autoJoinFired.current || !isInviteLink) return;
    autoJoinFired.current = true;
    const timer = setTimeout(async () => {
      try {
        const t = await joinTournament(user.uid, id);
        await refreshTournaments();
        setCurrentTournament(t);
        // tournament + members se actualizan vía onSnapshot
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

  function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async function handleRandomFill() {
    if (!user || randomFilling) return;
    setRandomFilling(true);
    try {
      if (activeGroup === "BONUS") {
        const teamsWithPlayers = ALL_TEAMS.filter(({ team }) => {
          const s = SQUADS[team];
          return s && (s.porteros.length + s.defensas.length + s.mediocampistas.length + s.delanteros.length > 0);
        });
        const allPlayersOf = (team: string) => {
          const s = SQUADS[team];
          return [...s.porteros, ...s.defensas, ...s.mediocampistas, ...s.delanteros];
        };

        const newChampion = bonusChampion || randomFrom(ALL_TEAMS).team;

        let newTSTeam = bonusTSTeam;
        let newTSPlayer = bonusTSPlayer;
        if (!newTSTeam) {
          newTSTeam = randomFrom(teamsWithPlayers).team;
          newTSPlayer = randomFrom(allPlayersOf(newTSTeam));
        } else if (!newTSPlayer && SQUADS[newTSTeam]) {
          const players = allPlayersOf(newTSTeam);
          if (players.length > 0) newTSPlayer = randomFrom(players);
        }

        let newBPTeam = bonusBPTeam;
        let newBPPlayer = bonusBPPlayer;
        if (!newBPTeam) {
          newBPTeam = randomFrom(teamsWithPlayers).team;
          newBPPlayer = randomFrom(allPlayersOf(newBPTeam));
        } else if (!newBPPlayer && SQUADS[newBPTeam]) {
          const players = allPlayersOf(newBPTeam);
          if (players.length > 0) newBPPlayer = randomFrom(players);
        }

        setBonusChampion(newChampion);
        setBonusTSTeam(newTSTeam);
        setBonusTSPlayer(newTSPlayer);
        setBonusBPTeam(newBPTeam);
        setBonusBPPlayer(newBPPlayer);

        await saveBonusPrediction(user.uid, id, {
          champion: newChampion,
          topScorerTeam: newTSTeam,
          topScorerPlayer: newTSPlayer,
          bestPlayerTeam: newBPTeam,
          bestPlayerPlayer: newBPPlayer,
        });
        setBonusToast(true);
        setTimeout(() => setBonusToast(false), 2500);
      } else {
        const targets = shownMatches.filter(
          (m) => !predMap[m.id] && new Date(m.date) > new Date()
        );
        await Promise.all(
          targets.map((match) => {
            const { home, away } = weightedRandomScore();
            return savePrediction(user.uid, match.id, home, away);
          })
        );
        setToast(true);
        setTimeout(() => setToast(false), 2500);
      }
    } finally {
      setRandomFilling(false);
    }
  }

  function handlePredChange(matchId: string, home: number | "", away: number | "") {
    setLocalEdits((prev) => ({ ...prev, [matchId]: { home, away } }));
  }

  async function handleSaveAll() {
    if (!user || saving || Object.keys(localEdits).length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(localEdits).map(([matchId, { home, away }]) => {
          if (home === "" && away === "" && predMap[matchId]) {
            return deletePrediction(user.uid, matchId);
          }
          if (home !== "" && away !== "") {
            return savePrediction(user.uid, matchId, Number(home), Number(away));
          }
          return Promise.resolve();
        })
      );
      setLocalEdits({});
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    } catch (err) { alert(err instanceof Error ? err.message : "Error al guardar"); }
    finally { setSaving(false); }
  }

  async function handleSaveBonus() {
    if (!user) return;
    setBonusSaving(true);
    try {
      await saveBonusPrediction(user.uid, id, {
        champion: bonusChampion,
        topScorerTeam: bonusTSTeam,
        topScorerPlayer: bonusTSPlayer,
        bestPlayerTeam: bonusBPTeam,
        bestPlayerPlayer: bonusBPPlayer,
      });
      setBonusToast(true);
      setTimeout(() => setBonusToast(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar bonus");
    } finally {
      setBonusSaving(false);
    }
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
      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${tournament.id}?action=invite`
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

      {/* Toasts */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Partido guardado
      </div>
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-celeste-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        bonusToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Bonus guardado
      </div>

      {/* Banner unirse */}
      {!isMember && user && (
        <div className="bg-celeste-50 border border-celeste-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-celeste-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sm text-ink-900">Uniéndote a <span className="font-semibold text-celeste-700">{tournament.name}</span>...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <Link href="/mis-predicciones" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-ink-900 transition-colors mb-2 group">
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Mis torneos
          </Link>
          <h1 className="text-2xl font-display font-extrabold text-ink-900">{tournament.name}</h1>
          <p className="text-gray-500 text-sm">{tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"}</p>
        </div>
        {isAdmin && <button onClick={share}
          className={`flex items-center gap-2 border rounded-xl px-4 py-2 text-sm transition-all mt-5 ${
            copied ? "border-celeste-300 text-celeste-700 bg-celeste-50" : "border-gray-200 text-ink-900 bg-white hover:bg-gray-50"
          }`}>
          {copied ? (
            <span className="font-semibold">✓ ¡Copiado!</span>
          ) : (
            <>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="font-medium">Invitar</span>
              <span className="font-mono text-xs text-celeste-600 tracking-widest">{tournament.id}</span>
            </>
          )}
        </button>}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mt-5 mb-5">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["tabla", "fixture"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === t ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30" : "text-ink-900 hover:text-ink-700"
              }`}>
              {t === "tabla" ? "Tabla" : "Fixture"}
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTab(tab === "admin" ? "tabla" : "admin")}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                tab === "admin" ? "bg-emerald-500 text-white shadow-sm" : "text-ink-900 hover:text-ink-700"
              }`}>
              ⚙ Admin
            </button>
          </div>
        )}
      </div>

      {/* Ad banner debajo de los tabs */}
      {tab !== "admin" && <AdBanner className="mb-5 rounded-xl overflow-hidden" />}

      {/* ── TABLA ── */}
      {tab === "tabla" && (
        <div className="flex flex-col gap-2">
          {members.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">Sin participantes aún</p>
              <p className="text-gray-400 text-sm mt-1">Compartí el código para que se unan</p>
            </div>
          )}
          {members.map((u) => {
            const isMe = user?.uid === u.uid;
            const pos = members.filter(m => (m.totalPoints || 0) > (u.totalPoints || 0)).length + 1;
            const name = u.displayName || u.email || "Jugador";
            return (
              <div key={u.uid} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border shadow-[var(--shadow-card)] ${
                isMe ? "bg-celeste-50 border-celeste-300" : "bg-white border-gray-200"
              }`}>
                {/* Posición */}
                <div className={`w-8 text-center font-bold flex-shrink-0 ${
                  pos === 1 ? "text-2xl" : "text-base text-gray-400"
                } ${pos === 1 ? "text-celeste-600" : pos === 2 ? "text-gray-500" : pos === 3 ? "text-amber-600" : ""}`}>
                  {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
                </div>

                {/* Avatar */}
                <UserAvatar uid={u.uid} photoURL={u.photoURL} size={36} />

                {/* Nombre + stats */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-900 text-sm flex items-center gap-1.5 flex-wrap">
                    {name}
                    {isMe && <span className="text-xs text-celeste-600 font-normal">(vos)</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex gap-3">
                    <span>{u.predictionsCount || 0} predicciones</span>
                    <span className="text-celeste-600/80">{u.partialCount || 0} parciales</span>
                    <span className="text-emerald-600/90">{u.exactCount || 0} exactos</span>
                  </div>
                </div>

                {/* Puntos */}
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-display font-extrabold text-celeste-600 leading-none tabular-nums">{u.totalPoints || 0}</div>
                  <div className="text-xs text-gray-400 mt-0.5">pts</div>
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

          {/* Phase tabs + botón al azar */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {PHASE_ORDER.map((ph) => {
                const phMatches = allMatches.filter((m) => m.phase === ph);
                const phDone = phMatches.length > 0 && phMatches.every((m) => predMap[m.id]);
                const isActive = activePhase === ph;
                const unlocked = ph === "group" || phMatches.some(
                  (m) => !m.homeTeam.includes("°") && !/^[WL] /.test(m.homeTeam)
                );
                return (
                  <button key={ph}
                    onClick={() => { if (!unlocked) return; setActivePhase(ph); if (ph === "group") setActiveGroup("A"); }}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                      !unlocked   ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : isActive  ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30"
                      : phDone    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      :             "bg-white border border-gray-200 text-gray-500 hover:border-celeste-300 hover:text-celeste-600"
                    }`}>
                    {PHASE_LABELS[ph]}
                  </button>
                );
              })}
            </div>

            {isMember && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {activeGroup !== "BONUS" && (
                  <button
                    onClick={handleSaveAll}
                    disabled={saving || Object.keys(localEdits).length === 0}
                    className="flex items-center gap-1.5 text-xs bg-celeste-500 text-white font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 hover:bg-celeste-600 shadow-sm shadow-celeste-500/30"
                  >
                    {saving ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : null}
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                )}
                <button
                  onClick={handleRandomFill}
                  disabled={randomFilling || (activeGroup !== "BONUS" && shownMatches.every((m) => predMap[m.id] || new Date(m.date) <= new Date()))}
                  className="flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 hover:border-celeste-300 hover:text-celeste-600 px-3 py-1.5 rounded-full font-medium transition-colors disabled:opacity-40"
                >
                  <svg className={`w-3.5 h-3.5 ${randomFilling ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {randomFilling ? "Llenando..." : "Al azar"}
                </button>
              </div>
            )}
          </div>

          {/* Group tabs + Bonus */}
          {activePhase === "group" && (
            <div className="flex gap-1.5 flex-wrap mb-4 items-center">
              {"ABCDEFGHIJKL".split("").map((g) => {
                const gMatches = allMatches.filter((m) => m.phase === "group" && m.group === g);
                const gDone = gMatches.length > 0 && gMatches.every((m) => predMap[m.id]);
                const isActive = activeGroup === g;
                return (
                  <button key={g} onClick={() => setActiveGroup(g)}
                    className={`w-8 h-8 rounded-lg font-bold text-sm transition-colors ${
                      isActive ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30"
                      : gDone ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-celeste-300 hover:text-celeste-600"
                    }`}>
                    {g}
                  </button>
                );
              })}
              <div className="w-px h-5 bg-gray-200 mx-0.5" />
              <button
                onClick={() => setActiveGroup("BONUS")}
                className={`px-3 h-8 rounded-lg font-bold text-sm transition-colors flex items-center gap-1.5 ${
                  activeGroup === "BONUS"
                    ? "bg-celeste-500 text-white shadow-sm shadow-celeste-500/30"
                    : bonusPred && (bonusPred.champion || bonusPred.topScorerPlayer || bonusPred.bestPlayerPlayer)
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-celeste-300 hover:text-celeste-600"
                }`}
              >
                ★ Bonus
              </button>
            </div>
          )}

          {activeGroup === "BONUS" ? (
            <BonusPanel
              isMember={isMember}
              champion={bonusChampion}
              tsTeam={bonusTSTeam}
              tsPlayer={bonusTSPlayer}
              bpTeam={bonusBPTeam}
              bpPlayer={bonusBPPlayer}
              onChampion={(v) => setBonusChampion(v)}
              onTSTeam={(v) => { setBonusTSTeam(v); setBonusTSPlayer(""); }}
              onTSPlayer={(v) => setBonusTSPlayer(v)}
              onBPTeam={(v) => { setBonusBPTeam(v); setBonusBPPlayer(""); }}
              onBPPlayer={(v) => setBonusBPPlayer(v)}
              onSave={handleSaveBonus}
              saving={bonusSaving}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {shownMatches.map((match) => (
                <div key={match.id} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 shadow-[var(--shadow-card)]">
                  {/* Teams */}
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="font-semibold text-sm text-ink-900 text-right">{match.homeTeam}</span>
                      <Flag code={match.homeFlagCode} />
                    </div>
                    <span className="text-gray-300 text-xs font-bold flex-shrink-0">vs</span>
                    <div className="flex items-center gap-1.5 flex-1">
                      <Flag code={match.awayFlagCode} />
                      <span className="font-semibold text-sm text-ink-900">{match.awayTeam}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-400 text-right sm:w-36 flex-shrink-0">
                    {formatDate(match.date)}
                  </div>

                  {/* Prediction */}
                  <div className="sm:w-40 flex justify-end flex-shrink-0">
                    {user && isMember ? (
                      <PredInput
                        match={match}
                        prediction={predMap[match.id]}
                        home={localEdits[match.id]?.home ?? predMap[match.id]?.homeScore ?? ""}
                        away={localEdits[match.id]?.away ?? predMap[match.id]?.awayScore ?? ""}
                        onChange={handlePredChange}
                      />
                    ) : match.homeScore !== null ? (
                      <span className="text-sm font-bold text-ink-900 tabular-nums">{match.homeScore} - {match.awayScore}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ADMIN ── */}
      {tab === "admin" && isAdmin && tournament && (
        <div className="flex flex-col gap-6">

          {/* Editar info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold text-ink-800 mb-4">Información del torneo</h3>
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
                      className="flex-1 bg-gray-50 border border-celeste-500 ring-2 ring-celeste-500/20 rounded-lg px-3 py-2 text-sm text-ink-900 focus:outline-none"
                    />
                    <button onClick={() => setEditingName(false)} className="text-xs text-gray-400 hover:text-ink-900 px-2">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-ink-800 text-sm">{editName || tournament.name}</span>
                    <button onClick={() => setEditingName(true)} title="Editar nombre"
                      className="text-gray-400 hover:text-celeste-600 transition-colors">
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 resize-none"
                />
              </div>
              <button
                onClick={handleSaveInfo}
                disabled={adminSaving || !editName.trim()}
                className="self-end bg-celeste-500 text-white font-bold px-5 py-2 rounded-lg text-sm hover:bg-celeste-600 disabled:opacity-50 transition-colors shadow-sm shadow-celeste-500/30"
              >
                {adminSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>

          {/* Gestión de miembros */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold text-ink-800 mb-4">
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
                  <div key={u.uid} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <UserAvatar uid={u.uid} photoURL={u.photoURL} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink-900 font-medium flex items-center gap-1.5 flex-wrap">
                        {name}
                        {isCreator && <span className="text-xs text-celeste-700 bg-celeste-50 px-1.5 py-0.5 rounded">Creador</span>}
                        {!isCreator && isUAdmin && <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Admin</span>}
                        {isMe && <span className="text-xs text-gray-400">(vos)</span>}
                      </div>
                      <div className="text-xs text-gray-400">{u.totalPoints || 0} pts</div>
                    </div>

                    {/* Acciones (no sobre el creador ni sobre uno mismo) */}
                    {!isCreator && !isMe && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        {isUAdmin ? (
                          <button
                            onClick={() => handleDemote(u.uid)}
                            disabled={busy}
                            className="text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded hover:bg-gray-50 disabled:opacity-40 transition-colors"
                          >
                            {busy ? "..." : "Quitar admin"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromote(u.uid)}
                            disabled={busy}
                            className="text-xs border border-indigo-200 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 disabled:opacity-40 transition-colors"
                          >
                            {busy ? "..." : "Hacer admin"}
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(u.uid)}
                          disabled={busy}
                          className="text-xs border border-red-200 text-red-500 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-40 transition-colors"
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
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" />
          <div className="relative bg-white border border-gray-200 rounded-2xl p-7 w-full max-w-sm shadow-[var(--shadow-pop)]">

            {modalView === "welcome" ? (
              <>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Te invitaron a</p>
                <h2 className="text-2xl font-display font-extrabold text-ink-900 mb-1">{tournament.name}</h2>
                <p className="text-sm text-gray-500 mb-7">
                  {tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"} · Registrate para predecir y competir.
                </p>

                {/* Google */}
                <button onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-ink-900 font-semibold py-3 rounded-xl mb-3 hover:bg-gray-50 transition-colors text-sm">
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
                  className="w-full bg-celeste-500 text-white font-bold py-3 rounded-xl mb-5 hover:bg-celeste-600 transition-colors text-sm shadow-sm shadow-celeste-500/30">
                  Registrarse con email
                </button>

                {regError && <p className="text-red-600 text-xs text-center mb-3">{regError}</p>}

                {/* Ya tengo cuenta */}
                <div className="text-center border-t border-gray-100 pt-4">
                  <button
                    onClick={() => router.push(`/login?redirect=/torneos/${id}`)}
                    className="text-sm text-gray-500 hover:text-ink-900 transition-colors"
                  >
                    Ya tengo cuenta · <span className="text-ink-900 font-semibold">Ingresar</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => { setModalView("welcome"); setRegError(""); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-ink-900 transition-colors mb-5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver
                </button>
                <h2 className="text-xl font-display font-extrabold text-ink-900 mb-5">Crear cuenta</h2>

                <div className="flex flex-col gap-3 mb-4">
                  <input
                    placeholder="Tu nombre"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
                    autoFocus
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailRegister()}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
                  />
                </div>

                {regError && <p className="text-red-600 text-xs mb-3">{regError}</p>}

                <button onClick={handleEmailRegister} disabled={regLoading}
                  className="w-full bg-celeste-500 text-white font-bold py-3 rounded-xl mb-4 hover:bg-celeste-600 disabled:opacity-50 transition-colors text-sm shadow-sm shadow-celeste-500/30">
                  {regLoading ? "Creando cuenta..." : "Crear cuenta y unirme"}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => router.push(`/login?redirect=/torneos/${id}`)}
                    className="text-sm text-gray-500 hover:text-ink-900 transition-colors"
                  >
                    Ya tengo cuenta · <span className="text-ink-900 font-semibold">Ingresar</span>
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
