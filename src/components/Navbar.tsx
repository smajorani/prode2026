"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isAdmin, logout, loading } = useAuth();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? "text-yellow-400" : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight text-yellow-400">
          Prode 2026
        </Link>

        {!loading && (
          <nav className="flex items-center gap-5">
            {navLink("/fixture", "Fixture")}
            {navLink("/leaderboard", "Tabla")}
            {user && navLink("/mis-predicciones", "Mis prodes")}
            {isAdmin && navLink("/admin", "Admin")}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden sm:block">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-yellow-400 text-gray-900 font-semibold px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
