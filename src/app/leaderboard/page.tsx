"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { subscribeLeaderboard } from "@/lib/firestore";
import { UserProfile } from "@/types";
import UserAvatar from "@/components/UserAvatar";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { currentTournament, tournaments, setCurrentTournament } = useTournament();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsub = subscribeLeaderboard(setAllUsers);
    return unsub;
  }, []);

  const users = currentTournament
    ? allUsers.filter((u) => currentTournament.members.includes(u.uid))
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900">Tabla de Posiciones</h1>

        {/* Selector de torneo */}
        {tournaments.length > 1 && (
          <select
            value={currentTournament?.id ?? ""}
            onChange={(e) => {
              const t = tournaments.find((t) => t.id === e.target.value);
              if (t) setCurrentTournament(t);
            }}
            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}

        {currentTournament && (
          <span className="text-xs bg-celeste-50 text-celeste-700 border border-celeste-200 px-3 py-1.5 rounded-full font-medium">
            {currentTournament.name} · {currentTournament.members.length} participantes
          </span>
        )}
      </div>

      {/* Sin torneo */}
      {user && tournaments.length === 0 && (
        <div className="bg-white border border-celeste-200 rounded-2xl p-6 text-center shadow-[var(--shadow-card)]">
          <p className="text-ink-900 font-semibold mb-1">Necesitás unirte a un torneo para ver la tabla</p>
          <p className="text-gray-500 text-sm mb-4">La tabla muestra solo a los participantes de tu torneo.</p>
          <Link href="/torneos" className="bg-celeste-500 text-white font-bold px-5 py-2 rounded-xl hover:bg-celeste-600 transition-colors text-sm shadow-sm shadow-celeste-500/30">
            Ir a Torneos
          </Link>
        </div>
      )}

      {!user && (
        <p className="text-gray-500 text-sm">
          <Link href="/login" className="text-celeste-600 font-semibold underline">Iniciá sesión</Link> para ver la tabla de tu torneo.
        </p>
      )}

      {currentTournament && users.length === 0 && (
        <p className="text-gray-500 text-sm">Todavía no hay puntajes. ¡El torneo empieza el 11 de junio!</p>
      )}

      <div className="flex flex-col gap-2">
        {users.map((u, i) => {
          const isMe = user?.uid === u.uid;
          return (
            <div key={u.uid} className={`flex items-center gap-4 border rounded-xl px-4 py-3 shadow-[var(--shadow-card)] ${
              isMe ? "border-celeste-300 bg-celeste-50" : "border-gray-200 bg-white"
            }`}>
              <div className={`w-8 text-center font-bold text-lg flex-shrink-0 ${
                i === 0 ? "text-celeste-600" : i === 1 ? "text-gray-500" : i === 2 ? "text-amber-600" : "text-gray-400"
              }`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>

              <UserAvatar uid={u.uid} photoURL={u.photoURL} size={32} />

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-ink-900 truncate">
                  {u.displayName || u.email}
                  {isMe && <span className="ml-2 text-xs text-celeste-600">Vos</span>}
                </div>
                <div className="text-xs text-gray-400">
                  {u.predictionsCount || 0} prodes · {u.exactCount || 0} exactos
                </div>
              </div>

              <div className="text-xl font-display font-extrabold text-celeste-600 flex-shrink-0 tabular-nums">{u.totalPoints || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
