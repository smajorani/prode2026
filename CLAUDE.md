@AGENTS.md

# Prode 2026 — Documentación del proyecto

## Stack
- **Next.js** (App Router, `"use client"` donde se necesita)
- **TypeScript**
- **Firebase** (Auth + Firestore — sin Storage, plan Spark gratuito)
- **Tailwind CSS v4** (`@import "tailwindcss"`, sin config file — usar clases arbitrarias `[...]` para valores custom)
- **Vercel** (deploy automático desde GitHub `smajorani/prode2026`)
- **Dominio**: prode2026.ar (delegado a Vercel nameservers)

## Restricciones críticas
- **NUNCA incluir `Co-Authored-By` en commits** — Vercel los rechaza y falla el deploy
- **Firebase Storage NO disponible** (plan Spark) — las fotos de perfil se guardan como base64 JPEG en Firestore
- **Firestore rules** deben publicarse manualmente en Firebase Console cada vez que cambien
- Firebase se inicializa solo en el cliente (guard `typeof window !== "undefined"` en `src/lib/firebase.ts`)
- **NUNCA inventar datos del fixture** — siempre usar `src/lib/fixture.ts` como fuente de verdad; si hay duda sobre equipos/grupos/horarios, preguntar al usuario

## Funcionalidades implementadas

### Autenticación
- Email/password + Google OAuth
- Al registrarse/loguearse se crea/verifica perfil en `users/{uid}` en Firestore
- Admin global: UID `K7owe52KlCS68DtzvJpm1N52ZA32` (puede cargar resultados de partidos)

### Fixture (`/fixture`)
- Vista **read-only** del fixture completo del Mundial 2026 (104 partidos)
- Tabs por fase: Grupos / R32 / Octavos / Cuartos / Semis / 3° / Final
- **Todas las fases siempre navegables** en el fixture público (aunque los equipos sean placeholders en eliminatorias)
- En Fase de Grupos: tabs A–L + tabla de posiciones por grupo (PJ G E P GF GC DG Pts)
- Layout desktop: partidos a la izquierda, tabla a la derecha (`lg:flex-row-reverse`)
- Layout mobile: tabla arriba, partidos abajo
- Los resultados se calculan en tiempo real desde Firestore (fallback al FIXTURE estático si no hay datos)

### Fixture estático (`src/lib/fixture.ts`)
- 104 partidos oficiales FIFA World Cup 2026 — **fuente: FIFA oficial**
- Grupos A–L con los 48 equipos reales del sorteo (5 dic 2025)
- **Argentina en Grupo J**: Argelia, Austria, Jordania
- Horarios en UTC (fixture oficial en Eastern US UTC-4, +4h para UTC → en Argentina = ET +1h)
- Fases eliminatorias con placeholders ("1° Grupo X", "W r32_N") hasta que se definan equipos
- Equipos identificados con flag codes ISO 3166-1 alpha-2 (Escocia: `gb-sct`, Inglaterra: `gb-eng`)

### Torneos (`/torneos`, `/torneos/[id]`)
- Crear torneo → genera código de 6 caracteres alfanumérico único (ID del torneo)
- Unirse con código → agrega al usuario como miembro
- Botón "Invitar" copia mensaje con link `?action=invite` al portapapeles (solo visible para admins)
- Tab **Tabla**: leaderboard de miembros en **tiempo real** (onSnapshot) con Pos / Avatar / Nombre / predicciones / parciales / exactos / Pts
- Tab **Fixture**: mismos partidos que `/fixture` pero con inputs de predicción por partido
  - Inputs de predicción: `type="number"` con flechas ocultas vía Tailwind (`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`)
  - **Sin botones OK individuales** — los cambios se acumulan en `localEdits` (estado local del page) y se guardan todos juntos con el botón **Guardar** (arriba a la derecha, junto a "Al azar")
  - Guardar se activa en cuanto se toca cualquier input; guarda en paralelo con `Promise.all`
  - Si ambos inputs se dejan vacíos para un partido que tenía predicción → `deletePrediction` borra la predicción de Firestore
  - Toast verde "Partido guardado" aparece tras guardar o tras "Al azar" exitoso
  - Partido bloqueado (🔒) si ya empezó
  - **Botón "Al azar"**: rellena con resultados ponderados por probabilidad histórica los partidos sin predicción del grupo/fase activa (usa `src/lib/scores.ts`); guarda en paralelo con `Promise.all` y muestra toast al terminar
  - En tab Bonus, "Al azar" elige campeón, equipo+jugador goleador, equipo+jugador mejor jugador al azar (respeta campos ya completados)
  - **Tabs de fase**: grisados y no clickeables en el fixture del torneo cuando la fase no tiene equipos reales aún (etapas eliminatorias con placeholders). En el fixture público `/fixture` siempre están habilitados
  - **Tabs de grupo**: se ponen verde suave cuando todos los partidos del grupo tienen predicción
  - **Tab Bonus**: botón `★ Bonus` a la derecha de las letras A–L. Muestra panel con 3 predicciones especiales (ver sección Bonus más abajo)
- Tab **Admin** (solo para admins del torneo): editar nombre/descripción, gestionar miembros (promover/degradar admin, quitar)
- **Modal de bienvenida** para usuarios no autenticados que abren un link de invitación: muestra nombre del torneo, permite registro con Google o email, "Ya tengo cuenta" → `/login?redirect=...`
- **Auto-join**: si la URL tiene `?action=invite` y el usuario no es miembro → join automático 500ms post-auth. Si no tiene el param, no auto-join (evita que usuarios removidos por un admin se re-unan solos)
- Lista de participantes y leaderboard actualizados en tiempo real: `subscribeTournament` + `subscribeLeaderboard` en paralelo

### Leaderboard — criterio de posiciones
- **Posición = cantidad de jugadores con más puntos + 1** (standard competition ranking)
- Jugadores con el mismo puntaje muestran el **mismo puesto** (1°, 1°, 3°, ...)
- Orden de visualización cuando hay empate: exactos desc → parciales desc → nombre asc
- Aplica tanto en la tabla del torneo como en las cards de "Mis torneos"

### Bonus predictions (`/torneos/[id]` → tab Fixture → botón ★ Bonus)
- Aparece como botón a la derecha de las letras de grupo (A–L) en el fixture del torneo
- Se pone verde cuando hay alguna predicción bonus guardada
- **3 categorías:**
  - **Campeón**: dropdown con los 48 equipos ordenados alfabéticamente
  - **Goleador**: dropdown de equipo → dropdown de jugador (cascading)
  - **Mejor jugador**: dropdown de equipo → dropdown de jugador (cascading)
- El dropdown de jugadores es un componente custom (no `<select>` nativo) con jugadores agrupados por posición: Arqueros / Defensores / Mediocampistas / Delanteros, cada grupo ordenado alfabéticamente
- Si el equipo no tiene plantel cargado, el dropdown de jugador queda deshabilitado con "Plantel no disponible"
- **Scoring:**
  - Campeón exacto: 20 pts
  - Jugador exacto (goleador/mejor jugador): 15 pts
  - Solo el equipo correcto (goleador/mejor jugador): 8 pts
- Guardado en Firestore: `bonusPredictions/{userId}_{tournamentId}`
- Funciones: `saveBonusPrediction`, `subscribeBonusPrediction` en `src/lib/firestore.ts`

### Planteles (`src/lib/squads.ts`)
- Los 48 equipos del Mundial con sus planteles completos (fuente: ESPN, mayo 2026)
- Interface `TeamSquad { flagCode, porteros, defensas, mediocampistas, delanteros }`
- `SQUADS: Record<string, TeamSquad>` — clave = nombre exacto del equipo en el fixture
- `ALL_TEAMS` — array con todos los equipos y sus flagCodes para el dropdown de campeón
- Referencia de estado de carga: `planteles.txt` en la raíz del proyecto

### Resultados aleatorios ponderados (`src/lib/scores.ts`)
- `weightedRandomScore()`: devuelve `{home, away}` con probabilidades basadas en frecuencias históricas de resultados de fútbol
- Scores más probables: 1-1 (11.3%), 1-0 (10.2%), 2-1 (8.3%), 0-0 (7.3%), etc.

### Sistema de predicciones
- Predicciones guardadas en Firestore como `predictions/{userId}_{matchId}`
- **No están ligadas al torneo** — son globales por usuario, el ranking filtra por miembros
- `savePrediction` verifica la fecha del partido (no permite predecir partidos ya iniciados) con fallback al FIXTURE estático si el partido no está en Firestore
- `deletePrediction(userId, matchId)` borra una predicción de Firestore (se llama cuando el usuario deja ambos inputs vacíos y guarda)

### Scoring
| Resultado | Grupos | Eliminatorias |
|-----------|--------|---------------|
| Exacto | 5 | 8 |
| Ganador + diferencia | 3 | 5 |
| Solo ganador | 2 | 3 |
| Goles de un equipo | 1 | 1 |
| Ninguno | 0 | 0 |

`partialCount` en `UserProfile` acumula predicciones con puntos > 0 pero no exactas.

### Perfil (`/perfil`)
- Editar nombre de usuario (actualiza Firebase Auth + Firestore)
- Cambiar foto: se redimensiona a 600×600px máx (sin upscale), JPEG calidad 0.95, se guarda como base64 en Firestore `users/{uid}.photoURL`
- `UserAvatar`: muestra foto si existe, fallback a círculo de color determinístico por UID (12 colores, hash de charCodes)
- **Eliminar cuenta** (botón discreto alineado a la derecha al fondo de la página):
  - Paso 1: modal de advertencia con lista de lo que se borra
  - Paso 2: slider de confirmación (arrastrar de izq a derecha al 95%)
  - Si Firebase tira `auth/requires-recent-login`: paso 3 de reautenticación (Google popup o contraseña según proveedor)
  - Al confirmar: borra predicciones + perfil Firestore en batch, luego `deleteUser()` de Firebase Auth

### Navbar
Fixture | Mis torneos | Perfil | Salir

## Archivos clave

| Archivo | Descripción |
|---------|-------------|
| `src/lib/firebase.ts` | Init Firebase (solo cliente, guard SSR) |
| `src/lib/firestore.ts` | CRUD matches, predictions, leaderboard, scoring |
| `src/lib/tournaments.ts` | CRUD torneos, isTournamentAdmin, subscribeTournament (onSnapshot) |
| `src/lib/fixture.ts` | Fixture estático completo (104 partidos, datos oficiales FIFA) |
| `src/lib/scores.ts` | Resultados aleatorios ponderados por probabilidad histórica |
| `src/lib/squads.ts` | Planteles de los 48 equipos organizados por posición (fuente: ESPN) |
| `src/lib/scoring.ts` | Lógica de puntuación |
| `src/types/index.ts` | Types: Match, Prediction, UserProfile, Tournament, Phase, SCORING |
| `src/context/AuthContext.tsx` | Auth state, ensureUserProfile |
| `src/context/TournamentContext.tsx` | Torneo activo, lista de torneos del usuario |
| `src/components/Navbar.tsx` | Barra de navegación |
| `src/components/UserAvatar.tsx` | Avatar con foto o color determinístico |
| `src/app/fixture/page.tsx` | Fixture read-only + tabla de posiciones |
| `src/app/torneos/page.tsx` | Crear / unirse a torneo |
| `src/app/torneos/[id]/page.tsx` | Detalle de torneo (Tabla / Fixture / Admin) |
| `src/app/mis-predicciones/page.tsx` | Listado de torneos del usuario con su posición |
| `src/app/perfil/page.tsx` | Editar nombre y foto de perfil |
| `src/app/admin/page.tsx` | Panel admin global (seedear fixture, cargar resultados) |
| `firestore.rules` | Reglas de seguridad Firestore (publicar manualmente) |

## Firestore collections
- `matches/{matchId}` — partidos con resultados
- `predictions/{userId}_{matchId}` — predicciones de goles de usuarios
- `bonusPredictions/{userId}_{tournamentId}` — predicciones bonus (champion, topScorerTeam, topScorerPlayer, bestPlayerTeam, bestPlayerPlayer)
- `users/{uid}` — perfiles (totalPoints, predictionsCount, partialCount, exactCount, photoURL como base64)
- `tournaments/{tournamentId}` — torneos (id=código 6 chars, admins[], members[])

## Firestore rules — puntos clave
- `predictions`: allow delete para soportar borrado de cuenta
- `bonusPredictions`: allow read pública, write solo al propio userId
- `tournaments`: allow update si `request.auth.uid in request.resource.data.members` → permite auto-join a cualquier usuario autenticado
- **Publicar manualmente** en Firebase Console cada vez que cambien

## Notas de diseño
- Fondo: `bg-gray-950` / `bg-gray-900` para cards
- Acento primario: `yellow-400`
- Acento admin: `green-500`
- Inputs numéricos siempre con clases para ocultar flechas del navegador
- Toasts: `fixed top-5 left-1/2 -translate-x-1/2` con transición opacity + translateY
- Tabs de fase en el fixture del torneo: grisado (`opacity-50 cursor-not-allowed`) cuando `homeTeam` contiene `°` o coincide con `/^[WL] /` (placeholder de eliminatoria)
- Dropdown de jugadores en Bonus: componente custom (no `<select>` nativo) para poder estilizar los headers de posición. Usa `useState` + `useRef` para open/close y click-outside
