"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { getTournament } from "@/lib/tournaments";
import { getLeaderboard } from "@/lib/firestore";
import { Tournament, UserProfile } from "@/types";

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { setCurrentTournament } = useTournament();
  const router = useRouter();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const t = await getTournament(id);
      if (!t) { router.push("/mis-predicciones"); return; }
      setTournament(t);
      setCurrentTournament(t);

      const allUsers = await getLeaderboard();
      const filtered = allUsers
        .filter((u) => t.members.includes(u.uid))
        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      setMembers(filtered);
      setLoading(false);
    }
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  function copyCode() {
    if (!tournament) return;
    navigator.clipboard.writeText(
      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${tournament.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      {/* Header */}
      <div className="mb-6">
        <Link href="/mis-predicciones" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-3 inline-block">
          ← Mis Prodes
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {tournament.members.length} {tournament.members.length === 1 ? "participante" : "participantes"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
            >
              <span className="font-mono font-bold tracking-widest text-yellow-400">{tournament.id}</span>
              <span className="text-gray-400">{copied ? "¡Copiado!" : "Copiar"}</span>
            </button>
            <Link
              href="/fixture"
              className="bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
            >
              Ver fixture
            </Link>
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
            <div
              key={u.uid}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 border transition-colors ${
                isMe
                  ? "bg-yellow-400/5 border-yellow-400/40"
                  : "bg-gray-900 border-gray-800"
              }`}
            >
              {/* Posición */}
              <div className={`w-8 text-center font-bold text-lg flex-shrink-0 ${
                pos === 1 ? "text-yellow-400" : pos === 2 ? "text-gray-300" : pos === 3 ? "text-amber-600" : "text-gray-500"
              }`}>
                {pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : pos}
              </div>

              {/* Avatar */}
              {u.photoURL ? (
                <img src={u.photoURL} alt="" className="w-9 h-9 rounded-full flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300 flex-shrink-0">
                  {(u.displayName || u.email)?.[0]?.toUpperCase()}
                </div>
              )}

              {/* Nombre */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {u.displayName || u.email}
                  {isMe && <span className="ml-2 text-xs text-yellow-400 font-normal">Vos</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {u.predictionsCount || 0} prodes · {u.exactCount || 0} exactos
                </div>
              </div>

              {/* Puntos */}
              <div className="text-xl font-bold text-yellow-400 flex-shrink-0">
                {u.totalPoints || 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
