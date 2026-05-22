import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
      <div>
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Prode Mundial 2026
        </h1>
        <p className="text-gray-400 text-lg max-w-md">
          Pronosticá los 104 partidos del Mundial y competí con todos.
          Ganás puntos por cada resultado que acertés.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/fixture"
          className="bg-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-colors text-lg"
        >
          Ver fixture
        </Link>
        <Link
          href="/leaderboard"
          className="border border-gray-700 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
        >
          Tabla de posiciones
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center mt-4">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold text-yellow-400">5 pts</div>
          <div className="text-xs text-gray-400 mt-1">Resultado exacto (grupos)</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold text-yellow-400">8 pts</div>
          <div className="text-xs text-gray-400 mt-1">Resultado exacto (eliminatorias)</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <div className="text-2xl font-bold text-yellow-400">104</div>
          <div className="text-xs text-gray-400 mt-1">Partidos para pronosticar</div>
        </div>
      </div>
    </div>
  );
}
