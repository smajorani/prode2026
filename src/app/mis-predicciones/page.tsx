"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { getLeaderboard } from "@/lib/firestore";
import { UserProfile } from "@/types";

function rankEmoji(pos: number) {
  if (pos === 1) return "🥇";
  if (pos === 2) return "🥈";
  if (pos === 3) return "🥉";
  return `#${pos}`;
}

export default function MisProdesPage() {
  const { user, loading: authLoading } = useAuth();
  const { tournaments, setCurrentTournament } = useTournament();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    getLeaderboard().then((u) => { setAllUsers(u); setUsersLoading(false); });
  }, []);

  if (authLoading || !user) return null;

  const meProfile = allUsers.find((u) => u.uid === user.uid);

  // Para cada torneo, calcular posición del usuario
  const tournamentCards = tournaments.map((t) => {
    const members = allUsers
      .filter((u) => t.members.includes(u.uid))
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    const myPos = members.findIndex((u) => u.uid === user.uid) + 1;
    const myPoints = meProfile?.totalPoints ?? 0;
    const myExact = meProfile?.exactCount ?? 0;

    return { tournament: t, members, myPos, myPoints, myExact };
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mis Prodes</h1>
        <Link
          href="/torneos"
          className="text-sm bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          + Crear / Unirse
        </Link>
      </div>

      {tournaments.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <p className="text-gray-300 font-semibold text-lg mb-1">No estás en ningún prode todavía</p>
          <p className="text-gray-500 text-sm mb-5">Creá uno o pedile el código a alguien.</p>
          <Link
            href="/torneos"
            className="bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Ir a Torneos
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tournamentCards.map(({ tournament, members, myPos, myPoints, myExact }) => (
          <Link
            key={tournament.id}
            href={`/torneos/${tournament.id}`}
            onClick={() => setCurrentTournament(tournament)}
            className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl px-5 py-4 flex items-center gap-5 transition-colors group"
          >
            {/* Posición */}
            <div className={`text-2xl font-bold w-12 text-center flex-shrink-0 ${
              myPos === 1 ? "text-yellow-400" : myPos === 2 ? "text-gray-300" : myPos === 3 ? "text-amber-600" : "text-gray-400"
            }`}>
              {usersLoading ? "—" : rankEmoji(myPos)}
            </div>

            {/* Info torneo */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-base truncate">{tournament.name}</div>
              <div className="text-sm text-gray-400 mt-0.5">
                {usersLoading ? (
                  <span className="text-gray-600">Cargando...</span>
                ) : (
                  <>
                    <span className="text-white font-semibold">{myPoints} pts</span>
                    {" · "}
                    {myExact} exactos
                    {" · "}
                    {members.length} {members.length === 1 ? "participante" : "participantes"}
                  </>
                )}
              </div>
            </div>

            {/* Código + flecha */}
            <div className="text-right flex-shrink-0">
              <div className="font-mono text-xs text-gray-600 tracking-widest mb-1">{tournament.id}</div>
              <div className="text-gray-600 group-hover:text-gray-400 transition-colors text-lg">›</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
