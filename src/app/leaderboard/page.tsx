"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { subscribeLeaderboard } from "@/lib/firestore";
import { UserProfile } from "@/types";

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
        <h1 className="text-2xl font-bold text-white">Tabla de Posiciones</h1>

        {/* Selector de torneo */}
        {tournaments.length > 1 && (
          <select
            value={currentTournament?.id ?? ""}
            onChange={(e) => {
              const t = tournaments.find((t) => t.id === e.target.value);
              if (t) setCurrentTournament(t);
            }}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}

        {currentTournament && (
          <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-full font-medium">
            {currentTournament.name} · {currentTournament.members.length} participantes
          </span>
        )}
      </div>

      {/* Sin torneo */}
      {user && tournaments.length === 0 && (
        <div className="bg-gray-900 border border-yellow-400/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-1">Necesitás unirte a un torneo para ver la tabla</p>
          <p className="text-gray-400 text-sm mb-4">La tabla muestra solo a los participantes de tu torneo.</p>
          <Link href="/torneos" className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm">
            Ir a Torneos
          </Link>
        </div>
      )}

      {!user && (
        <p className="text-gray-400 text-sm">
          <Link href="/login" className="text-yellow-400 underline">Iniciá sesión</Link> para ver la tabla de tu torneo.
        </p>
      )}

      {currentTournament && users.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no hay puntajes. ¡El torneo empieza el 11 de junio!</p>
      )}

      <div className="flex flex-col gap-2">
        {users.map((u, i) => {
          const isMe = user?.uid === u.uid;
          return (
            <div key={u.uid} className={`flex items-center gap-4 bg-gray-900 border rounded-xl px-4 py-3 ${
              isMe ? "border-yellow-400/50 bg-yellow-400/5" : "border-gray-800"
            }`}>
              <div className={`w-8 text-center font-bold text-lg flex-shrink-0 ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"
              }`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>

              {u.photoURL ? (
                <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300 flex-shrink-0">
                  {(u.displayName || u.email)?.[0]?.toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-white truncate">
                  {u.displayName || u.email}
                  {isMe && <span className="ml-2 text-xs text-yellow-400">Vos</span>}
                </div>
                <div className="text-xs text-gray-500">
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
