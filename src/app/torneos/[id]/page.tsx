"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { getTournament, joinTournament } from "@/lib/tournaments";
import { getLeaderboard } from "@/lib/firestore";
import { Tournament, UserProfile } from "@/types";

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMember = !!user && (tournament?.members.includes(user.uid) ?? false);

  useEffect(() => {
    async function load() {
      const t = await getTournament(id);
      if (!t) { router.push("/mis-predicciones"); return; }
      setTournament(t);
      // Solo seleccionar como activo si el usuario ya es miembro
      if (user && t.members.includes(user.uid)) setCurrentTournament(t);

      const allUsers = await getLeaderboard();
      setMembers(
        allUsers
          .filter((u) => t.members.includes(u.uid))
          .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      );
      setLoading(false);
    }
    load();
  }, [id, user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleJoin() {
    if (!user) { router.push(`/login?redirect=/torneos/${id}`); return; }
    setJoining(true);
    try {
      const t = await joinTournament(user.uid, id);
      await refreshTournaments();
      setCurrentTournament(t);
      // Recargar la página para mostrar estado actualizado
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al unirse");
    } finally {
      setJoining(false);
    }
  }

  function share() {
    if (!tournament) return;
    const msg = `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${tournament.id}`;
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!tournament) return null;

  return (
    <div className="max-w-2xl mx-auto">

      {/* Banner de unirse (visitante no-miembro) */}
      {!isMember && (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-white font-semibold">Te invitaron a <span className="text-yellow-400">{tournament.name}</span></p>
            <p className="text-gray-400 text-sm mt-0.5">Sumate para participar y ver la tabla de posiciones.</p>
          </div>
          <button
            onClick={handleJoin}
            disabled={joining}
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {joining ? "Uniéndose..." : user ? "Unirme" : "Iniciá sesión para unirte"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link href="/mis-predicciones" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-3 inline-block">
          ← Mis Prodes
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Botón compartir */}
            <button
              onClick={share}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors ${
                copied
                  ? "border-yellow-400/50 text-yellow-400 bg-yellow-400/10"
                  : "border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {copied ? (
                <>✓ <span>¡Copiado!</span></>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Invitar</span>
                  <span className="font-mono text-xs text-yellow-400 tracking-widest">{tournament.id}</span>
                </>
              )}
            </button>

            {isMember && (
              <Link
                href="/fixture"
                className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
              >
                Ver fixture
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col gap-2">
        {members.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-10">
            Todavía no hay puntajes. ¡El torneo empieza el 11 de junio!
          </p>
        )}

        {members.map((u, i) => {
          const isMe = user?.uid === u.uid;
          const pos = i + 1;
          return (
            <div key={u.uid} className={`flex items-center gap-4 rounded-xl px-4 py-3 border ${
              isMe ? "bg-yellow-400/5 border-yellow-400/40" : "bg-gray-900 border-gray-800"
            }`}>
              <div className={`w-8 text-center font-bold text-lg flex-shrink-0 ${
                pos === 1 ? "text-yellow-400" : pos === 2 ? "text-gray-300" : pos === 3 ? "text-amber-600" : "text-gray-500"
              }`}>
                {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
              </div>

              {u.photoURL ? (
                <img src={u.photoURL} alt="" className="w-9 h-9 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300 flex-shrink-0">
                  {(u.displayName || u.email)?.[0]?.toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {u.displayName || u.email}
                  {isMe && <span className="ml-2 text-xs text-yellow-400 font-normal">Vos</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {u.predictionsCount || 0} prodes · {u.exactCount || 0} exactos
                </div>
              </div>

              <div className="text-xl font-bold text-yellow-400 flex-shrink-0">{u.totalPoints || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
