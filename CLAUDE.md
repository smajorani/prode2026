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

## Funcionalidades implementadas

### Autenticación
- Email/password + Google OAuth
- Al registrarse/loguearse se crea/verifica perfil en `users/{uid}` en Firestore
- Admin global: UID `K7owe52KlCS68DtzvJpm1N52ZA32` (puede cargar resultados de partidos)

### Fixture (`/fixture`)
- Vista **read-only** del fixture completo del Mundial 2026 (104 partidos)
- Tabs por fase: Grupos / R32 / Octavos / Cuartos / Semis / 3° / Final
- En Fase de Grupos: tabs A–L + tabla de posiciones por grupo (PJ G E P GF GC DG Pts)
- Layout desktop: partidos a la izquierda, tabla a la derecha (`lg:flex-row-reverse`)
- Layout mobile: tabla arriba, partidos abajo
- Los resultados se calculan en tiempo real desde Firestore (fallback al FIXTURE estático si no hay datos)

### Torneos (`/torneos`, `/torneos/[id]`)
- Crear torneo → genera código de 6 caracteres alfanumérico único (ID del torneo)
- Unirse con código → agrega al usuario como miembro
- Botón "Invitar" copia mensaje con link `?action=invite` al portapapeles
- Tab **Tabla**: leaderboard de miembros en **tiempo real** (onSnapshot) con Pos / Avatar / Nombre / predicciones / parciales / exactos / Pts
- Tab **Fixture**: mismos partidos que `/fixture` pero con inputs de predicción por partido
  - Inputs de predicción: `type="number"` con flechas ocultas vía Tailwind (`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`)
  - Toast verde "Partido guardado" al guardar exitosamente
  - Partido bloqueado (🔒) si ya empezó
- Tab **Admin** (solo para admins del torneo): editar nombre/descripción, gestionar miembros (promover/degradar admin, quitar)
- **Modal de bienvenida** para usuarios no autenticados que abren un link de invitación: muestra nombre del torneo, permite registro con Google o email, "Ya tengo cuenta" → `/login?redirect=...`
- **Auto-join**: si la URL tiene `?action=invite` y el usuario es miembro → join automático 500ms post-auth. Si no tiene el param, no auto-join (evita que usuarios removidos por un admin se re-unan solos)
- Lista de participantes y leaderboard actualizados en tiempo real: `subscribeTournament` + `subscribeLeaderboard` en paralelo

### Sistema de predicciones
- Predicciones guardadas en Firestore como `predictions/{userId}_{matchId}`
- **No están ligadas al torneo** — son globales por usuario, el ranking filtra por miembros
- `savePrediction` verifica la fecha del partido (no permite predecir partidos ya iniciados) con fallback al FIXTURE estático si el partido no está en Firestore

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
- **Eliminar cuenta** (zona peligrosa al fondo, discreta):
  - Paso 1: modal de advertencia con lista de lo que se borra
  - Paso 2: slider de confirmación (arrastrar de izq a derecha al 95%)
  - Si Firebase tira `auth/requires-recent-login`: paso 3 de reautenticación (Google popup o contraseña según proveedor)
  - Al confirmar: borra predicciones + perfil Firestore en batch, luego `deleteUser()` de Firebase Auth

### Navbar
Fixture | Mis prodes | Torneos | Perfil | Salir

## Archivos clave

| Archivo | Descripción |
|---------|-------------|
| `src/lib/firebase.ts` | Init Firebase (solo cliente, guard SSR) |
| `src/lib/firestore.ts` | CRUD matches, predictions, leaderboard, scoring |
| `src/lib/tournaments.ts` | CRUD torneos, isTournamentAdmin, subscribeTournament (onSnapshot) |
| `src/lib/fixture.ts` | Fixture estático completo (104 partidos) |
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
- `predictions/{userId}_{matchId}` — predicciones de usuarios
- `users/{uid}` — perfiles (totalPoints, predictionsCount, partialCount, exactCount, photoURL como base64)
- `tournaments/{tournamentId}` — torneos (id=código 6 chars, admins[], members[])

## Firestore rules — puntos clave
- `predictions`: allow delete para soportar borrado de cuenta
- `tournaments`: allow update si `request.auth.uid in request.resource.data.members` → permite auto-join a cualquier usuario autenticado
- **Publicar manualmente** en Firebase Console cada vez que cambien

## Notas de diseño
- Fondo: `bg-gray-950` / `bg-gray-900` para cards
- Acento primario: `yellow-400`
- Acento admin: `green-500`
- Inputs numéricos siempre con clases para ocultar flechas del navegador
- Toasts: `fixed top-5 left-1/2 -translate-x-1/2` con transición opacity + translateY
