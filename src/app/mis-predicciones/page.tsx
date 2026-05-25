"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { getLeaderboard } from "@/lib/firestore";
import { createTournament, joinTournament } from "@/lib/tournaments";
import { Tournament, UserProfile } from "@/types";

function rankEmoji(pos: number) {
  if (pos === 1) return "🥇";
  if (pos === 2) return "🥈";
  if (pos === 3) return "🥉";
  return `#${pos}`;
}

export default function MisTorneosPage() {
  const { user, loading: authLoading } = useAuth();
  const { tournaments, setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "join" | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Tournament | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    getLeaderboard().then((u) => { setAllUsers(u); setUsersLoading(false); });
  }, []);

  if (authLoading || !user) return null;

  const meProfile = allUsers.find((u) => u.uid === user.uid);

  const tournamentCards = tournaments.map((t) => {
    const members = allUsers
      .filter((u) => t.members.includes(u.uid))
      .sort((a, b) => {
        const pts = (b.totalPoints || 0) - (a.totalPoints || 0);
        if (pts !== 0) return pts;
        const ex = (b.exactCount || 0) - (a.exactCount || 0);
        if (ex !== 0) return ex;
        return (b.partialCount || 0) - (a.partialCount || 0);
      });
    const myPts = meProfile?.totalPoints ?? 0;
    const myPos = members.filter(m => (m.totalPoints || 0) > myPts).length + 1;
    const myPoints = meProfile?.totalPoints ?? 0;
    const myExact = meProfile?.exactCount ?? 0;
    return { tournament: t, members, myPos, myPoints, myExact };
  });

  function openCreate() { setModal("create"); setError(""); setName(""); setCreated(null); }
  function openJoin()   { setModal("join");   setError(""); setCode(""); }
  function closeModal() { setModal(null); setCreated(null); }

  async function handleCreate() {
    if (!name.trim()) { setError("Ingresá un nombre para el torneo"); return; }
    setModalLoading(true); setError("");
    try {
      const t = await createTournament(user!.uid, name);
      await refreshTournaments();
      setCurrentTournament(t);
      setCreated(t);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el torneo");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleJoin() {
    if (!code.trim()) { setError("Ingresá el código del torneo"); return; }
    setModalLoading(true); setError("");
    try {
      const t = await joinTournament(user!.uid, code);
      await refreshTournaments();
      setCurrentTournament(t);
      closeModal();
      router.push(`/torneos/${t.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al unirse");
    } finally {
      setModalLoading(false);
    }
  }

  const inputCls =
    "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 transition";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900">Mis torneos</h1>
        <div className="flex gap-2">
          <button
            onClick={openJoin}
            className="text-sm border border-gray-200 bg-white text-ink-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Unirse
          </button>
          <button
            onClick={openCreate}
            className="text-sm bg-celeste-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-celeste-600 transition-colors shadow-sm shadow-celeste-500/30"
          >
            + Crear
          </button>
        </div>
      </div>

      {tournaments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-[var(--shadow-card)]">
          <p className="text-ink-900 font-semibold text-lg mb-1">No estás en ningún torneo todavía</p>
          <p className="text-gray-500 text-sm mb-5">Creá uno o pedile el código a alguien.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={openJoin} className="border border-gray-200 text-ink-900 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Unirse
            </button>
            <button onClick={openCreate} className="bg-celeste-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-celeste-600 transition-colors text-sm shadow-sm shadow-celeste-500/30">
              Crear torneo
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tournamentCards.map(({ tournament, members, myPos, myPoints, myExact }) => (
          <Link
            key={tournament.id}
            href={`/torneos/${tournament.id}`}
            onClick={() => setCurrentTournament(tournament)}
            className="bg-white border border-gray-200 hover:border-celeste-300 rounded-2xl px-5 py-4 flex items-center gap-5 transition-colors group shadow-[var(--shadow-card)]"
          >
            <div className={`text-2xl font-bold w-12 text-center flex-shrink-0 ${
              myPos === 1 ? "text-celeste-600" : myPos === 2 ? "text-gray-500" : myPos === 3 ? "text-amber-600" : "text-gray-400"
            }`}>
              {usersLoading ? "—" : rankEmoji(myPos)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-ink-900 text-base truncate">{tournament.name}</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {usersLoading ? (
                  <span className="text-gray-400">Cargando...</span>
                ) : (
                  <>
                    <span className="text-ink-900 font-semibold">{myPoints} pts</span>
                    {" · "}{myExact} exactos
                    {" · "}{members.length} {members.length === 1 ? "participante" : "participantes"}
                  </>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-xs text-gray-400 tracking-widest mb-1">{tournament.id}</div>
              <div className="text-gray-300 group-hover:text-celeste-500 transition-colors text-lg">›</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal crear */}
      {modal === "create" && (
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={closeModal}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-[var(--shadow-pop)]" onClick={(e) => e.stopPropagation()}>
            {created ? (
              <>
                <h2 className="text-xl font-display font-extrabold text-ink-900 mb-1">¡Torneo creado!</h2>
                <p className="text-gray-500 text-sm mb-5">Compartí este código con tus amigos para que se unan:</p>
                <div className="bg-celeste-50 border border-celeste-200 rounded-xl p-6 text-center mb-5">
                  <div className="text-4xl font-mono font-bold tracking-[0.3em] text-celeste-600">{created.id}</div>
                  <div className="text-xs text-gray-500 mt-2">{created.name}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(
                      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${created.id}?action=invite`
                    )}
                    className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Copiar invitación
                  </button>
                  <button
                    onClick={() => { closeModal(); router.push(`/torneos/${created.id}`); }}
                    className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 transition-colors"
                  >
                    Ir al torneo
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-display font-extrabold text-ink-900 mb-4">Crear torneo</h2>
                <input
                  type="text"
                  placeholder="Nombre (ej: Torneo familia)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className={`w-full mb-3 ${inputCls}`}
                  autoFocus
                  maxLength={40}
                />
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={closeModal} className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
                  <button onClick={handleCreate} disabled={modalLoading} className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50">
                    {modalLoading ? "Creando..." : "Crear"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal unirse */}
      {modal === "join" && (
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={closeModal}>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-[var(--shadow-pop)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-display font-extrabold text-ink-900 mb-2">Unirse a un torneo</h2>
            <p className="text-gray-500 text-sm mb-4">Pedile el código de 6 letras al creador.</p>
            <input
              type="text"
              placeholder="CÓDIGO"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className={`w-full mb-3 font-mono tracking-widest uppercase text-center text-lg ${inputCls}`}
              autoFocus
              maxLength={6}
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={closeModal} className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={handleJoin} disabled={modalLoading} className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50">
                {modalLoading ? "Uniéndose..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
