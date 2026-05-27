"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { usePathname, useRouter } from "next/navigation";
import Ball from "@/components/Ball";
import { db } from "@/lib/firebase";
import SupportModal from "@/components/SupportModal";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { currentTournament, tournaments, setCurrentTournament } = useTournament();
  const pathname = usePathname();
  const router = useRouter();
  const [isSupporter, setIsSupporter] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    if (!user) { setIsSupporter(false); return; }
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setIsSupporter(snap.data()?.supporter === true);
    });
    return unsub;
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm font-semibold transition-colors ${
          active ? "text-celeste-600" : "text-gray-500 hover:text-ink-900"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <Ball size={26} className="transition-transform group-hover:rotate-[25deg]" />
          <span className="font-display font-extrabold text-lg tracking-tight text-ink-900">
            Prode <span className="text-celeste-600">2026</span>
          </span>
        </Link>

        {!loading && (
          <nav className="flex items-center gap-5 flex-1 justify-end">
            {navLink("/fixture", "Fixture")}
            <span className="hidden sm:contents">
              {navLink("/como-funciona", "¿Cómo funciona?")}
            </span>
            {user && navLink("/mis-predicciones", "Mis torneos")}

            {/* Selector de torneo rápido */}
            {user && tournaments.length > 1 && pathname.startsWith("/torneos") && (
              <select
                value={currentTournament?.id ?? ""}
                onChange={(e) => {
                  const t = tournaments.find((t) => t.id === e.target.value);
                  if (t) {
                    setCurrentTournament(t);
                    router.push(`/torneos/${t.id}`);
                  }
                }}
                className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 max-w-[130px] truncate"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}

            {user && !isSupporter && (
              <button
                onClick={() => setShowSupportModal(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors flex-shrink-0"
              >
                Sin anuncios ★
              </button>
            )}

            {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}

            {user ? (
              <div className="flex items-center gap-4">
                {navLink("/perfil", "Perfil")}
                <button
                  onClick={logout}
                  className="text-xs font-medium text-gray-400 hover:text-ink-900 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-celeste-500 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-celeste-600 transition-colors flex-shrink-0 shadow-sm shadow-celeste-500/30"
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
