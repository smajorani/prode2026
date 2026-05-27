import Link from "next/link";
import Ball from "@/components/Ball";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] text-center gap-10">
      <div className="flex flex-col items-center">
        {/* Pelota con halo celeste */}
        <div className="relative mb-7">
          <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-celeste-300 rounded-full scale-150" />
          <Ball size={84} className="animate-spin-slow drop-shadow-[0_8px_24px_rgba(31,147,218,0.35)]" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-celeste-600 mb-3">
          Mundial 2026
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-ink-900 mb-4 text-balance">
          El prode del <span className="text-celeste-600">Mundial</span>,<br className="hidden sm:block" /> con tus amigos
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-md text-balance">
          Pronosticá los 104 partidos, sumá puntos por cada acierto y peleá la punta de la tabla en vivo.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-6 sm:px-0">
        <Link
          href="/fixture"
          className="bg-celeste-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-celeste-600 transition-colors text-base shadow-md shadow-celeste-500/25"
        >
          Ver fixture
        </Link>
        <Link
          href="/leaderboard"
          className="bg-white border border-gray-200 text-ink-900 font-semibold px-8 py-3.5 rounded-xl hover:border-celeste-300 hover:bg-celeste-50/50 transition-colors text-base shadow-sm"
        >
          Tabla de posiciones
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl mt-2">
        {[
          { n: "5 pts", l: "Resultado exacto en grupos" },
          { n: "8 pts", l: "Resultado exacto en eliminatorias" },
          { n: "104", l: "Partidos para pronosticar" },
        ].map((s) => (
          <div
            key={s.l}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-[var(--shadow-card)]"
          >
            <div className="text-xl sm:text-2xl font-display font-extrabold text-celeste-600">{s.n}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-snug">{s.l}</div>
          </div>
        ))}
      </div>

      <Link
        href="/como-funciona"
        className="text-sm text-gray-400 hover:text-celeste-600 transition-colors mt-2"
      >
        ¿No sabés cómo funciona? →
      </Link>
    </div>
  );
}
