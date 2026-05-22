"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { subscribeLeaderboard } from "@/lib/firestore";
import { UserProfile } from "@/types";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsub = subscribeLeaderboard(setUsers);
    return unsub;
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tabla de Posiciones</h1>

      {users.length === 0 && (
        <p className="text-gray-400 text-sm">Todavía no hay puntajes. ¡El torneo empieza el 11 de junio!</p>
      )}

      <div className="flex flex-col gap-2">
        {users.map((u, i) => {
          const isMe = user?.uid === u.uid;
          return (
            <div
              key={u.uid}
              className={`flex items-center gap-4 bg-gray-900 border rounded-xl px-4 py-3 transition-colors ${
                isMe ? "border-yellow-400/50 bg-yellow-400/5" : "border-gray-800"
              }`}
            >
              {/* Position */}
              <div className={`w-8 text-center font-bold text-lg ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"
              }`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </div>

              {/* Avatar */}
              {u.photoURL ? (
                <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
                  {(u.displayName || u.email)?.[0]?.toUpperCase()}
                </div>
              )}

              {/* Name */}
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {u.displayName || u.email}
                  {isMe && <span className="ml-2 text-xs text-yellow-400">Vos</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {u.predictionsCount || 0} prodes · {u.exactCount || 0} exactos
                </div>
              </div>

              {/* Points */}
              <div className="text-xl font-bold text-yellow-400">{u.totalPoints || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
