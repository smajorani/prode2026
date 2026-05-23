"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isAdmin, logout, loading } = useAuth();
  const { currentTournament, tournaments, setCurrentTournament } = useTournament();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link href={href} className={`text-sm font-medium transition-colors ${
      pathname === href ? "text-yellow-400" : "text-gray-300 hover:text-white"
    }`}>
      {label}
    </Link>
  );

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-yellow-400 flex-shrink-0">
          Prode 2026
        </Link>

        {!loading && (
          <nav className="flex items-center gap-4 flex-1 justify-end">
            {navLink("/fixture", "Fixture")}
            {user && navLink("/mis-predicciones", "Mis prodes")}
            {user && navLink("/torneos", "Torneos")}

            {/* Selector de torneo rápido */}
            {user && tournaments.length > 1 && (
              <select
                value={currentTournament?.id ?? ""}
                onChange={(e) => {
                  const t = tournaments.find((t) => t.id === e.target.value);
                  if (t) setCurrentTournament(t);
                }}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none max-w-[120px] truncate"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[100px]">
                  {user.displayName || user.email}
                </span>
                <button onClick={logout} className="text-xs text-gray-400 hover:text-white transition-colors">
                  Salir
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded hover:bg-yellow-300 transition-colors flex-shrink-0">
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
