import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "¿Cómo funciona?",
  description:
    "Aprendé cómo jugar al Prode Mundial 2026: creá o unite a un torneo, hacé tus predicciones y competí con tus amigos.",
};

const steps = [
  {
    n: "1",
    title: "Creá o unite a un torneo",
    body: "Creá un torneo privado y compartí el código de 6 letras con tus amigos. Ellos se unen con ese código desde cualquier dispositivo. También podés mandar el link directo y se unen solos.",
  },
  {
    n: "2",
    title: "Pronosticá los 104 partidos",
    body: "Ingresá el marcador que esperás para cada partido antes de que empiece. En cuanto el árbitro pita el inicio, el partido se bloquea y ya no se puede modificar.",
  },
  {
    n: "3",
    title: "Sumá puntos por cada acierto",
    body: "Cuando se carga el resultado oficial, tus predicciones se puntúan automáticamente. Hay puntos por acertar el resultado exacto, el ganador, la diferencia de goles o los goles de un equipo.",
  },
  {
    n: "4",
    title: "Seguí la tabla en vivo",
    body: "El leaderboard de tu torneo se actualiza en tiempo real. Ves tu posición, cuántos puntos exactos y parciales acumulaste, y cómo estás respecto al resto del grupo.",
  },
];

const pointRows = [
  { reason: "Resultado exacto", group: 5, elim: 8 },
  { reason: "Ganador + diferencia de goles", group: 3, elim: 5 },
  { reason: "Solo el ganador", group: 2, elim: 3 },
  { reason: "Goles de un equipo", group: 1, elim: 1 },
  { reason: "Sin aciertos", group: 0, elim: 0 },
];

const bonuses = [
  {
    pts: "20 pts",
    title: "Campeón del mundo",
    desc: "Elegís el equipo que va a levantar la copa. Si acertás, sumás 20 puntos de golpe.",
  },
  {
    pts: "8 / 15 pts",
    title: "Goleador del torneo",
    desc: "Elegís el equipo y el jugador goleador. 8 pts si acertás el equipo, 15 pts si acertás el jugador exacto.",
  },
  {
    pts: "8 / 15 pts",
    title: "Mejor jugador",
    desc: "Igual que el goleador, pero para el MVP del torneo. 8 pts por el equipo, 15 pts por el jugador.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-celeste-600 mb-3">
          Guía
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900 mb-4">
          ¿Cómo funciona?
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto text-balance">
          Todo lo que necesitás saber para armar tu grupo, pronosticar los 104 partidos y pelear la punta.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        {steps.map(({ n, title, body }) => (
          <div
            key={n}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[var(--shadow-card)]"
          >
            <div className="w-8 h-8 rounded-full bg-celeste-500 text-white text-sm font-extrabold flex items-center justify-center mb-4 flex-shrink-0">
              {n}
            </div>
            <h3 className="font-display font-bold text-ink-900 mb-2 text-base">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mb-14" />

      {/* Points table */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 mb-1">
          Tabla de puntos
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Los puntos son más altos en eliminatorias porque predecir se pone más difícil.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3.5 font-semibold text-ink-900">Tipo de acierto</th>
                <th className="text-center px-4 py-3.5 font-semibold text-celeste-600 whitespace-nowrap">
                  Grupos
                </th>
                <th className="text-center px-4 py-3.5 font-semibold text-celeste-600 whitespace-nowrap">
                  Eliminatorias
                </th>
              </tr>
            </thead>
            <tbody>
              {pointRows.map(({ reason, group, elim }, i) => (
                <tr
                  key={reason}
                  className={`${i < pointRows.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}
                >
                  <td className="px-5 py-3.5 text-ink-900">{reason}</td>
                  <td className="px-4 py-3.5 text-center">
                    {group > 0 ? (
                      <span className="font-extrabold text-celeste-600">{group} pts</span>
                    ) : (
                      <span className="text-gray-300 font-medium">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {elim > 0 ? (
                      <span className="font-extrabold text-celeste-600">{elim} pts</span>
                    ) : (
                      <span className="text-gray-300 font-medium">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-3 px-1">
          "Goles de un equipo" se aplica cuando pronosticaste bien los goles de local o de visitante, pero no el resultado completo.
        </p>
      </div>

      <div className="border-t border-gray-100 mb-14" />

      {/* Bonus */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 mb-1">
          Predicciones bonus
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Además de los partidos, podés apostar por resultados especiales que valen muchos puntos. Se cargan una sola vez, antes de que arranque el torneo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {bonuses.map(({ pts, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[var(--shadow-card)]"
            >
              <div className="text-2xl font-extrabold text-yellow-500 mb-2 font-display">
                {pts}
              </div>
              <h3 className="font-semibold text-ink-900 mb-1.5 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-14" />

      {/* Preguntas frecuentes */}
      <div className="mb-14">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink-900 mb-6">
          Preguntas frecuentes
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "¿Puedo estar en más de un torneo?",
              a: "Sí. Podés crear o unirte a tantos torneos como quieras. Tus predicciones son globales: el mismo pronóstico cuenta en todos los torneos en los que participás.",
            },
            {
              q: "¿Hasta cuándo puedo predecir un partido?",
              a: "Hasta el momento exacto en que empieza. Una vez que el partido arrancó, el input se bloquea con un candado y no se puede modificar.",
            },
            {
              q: "¿Qué pasa si dejo un partido sin predecir?",
              a: "No suma puntos, pero tampoco resta. También podés usar el botón \"Al azar\" para que el sistema rellene automáticamente todos los partidos que te faltaron, usando probabilidades históricas de resultados.",
            },
            {
              q: "¿Las predicciones bonus se pueden cambiar?",
              a: "Sí, hasta que el torneo empiece. Podés editarlas cuantas veces quieras desde el panel Bonus dentro de tu torneo.",
            },
            {
              q: "¿Cómo se desempata en la tabla?",
              a: "Si dos jugadores tienen los mismos puntos, se ordena por cantidad de resultados exactos (desc), luego por parciales (desc), y finalmente por nombre alfabético.",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-[var(--shadow-card)]"
            >
              <p className="font-semibold text-ink-900 mb-1.5 text-sm">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-100 pt-10 text-center">
        <p className="text-gray-500 mb-6 text-base">¿Listo para jugar?</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/torneos"
            className="bg-celeste-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-celeste-600 transition-colors text-base shadow-md shadow-celeste-500/25"
          >
            Crear un torneo
          </Link>
          <Link
            href="/fixture"
            className="bg-white border border-gray-200 text-ink-900 font-semibold px-8 py-3.5 rounded-xl hover:border-celeste-300 hover:bg-celeste-50/50 transition-colors text-base shadow-sm"
          >
            Ver el fixture
          </Link>
        </div>
      </div>
    </div>
  );
}
