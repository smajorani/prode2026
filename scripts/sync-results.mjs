/**
 * Sync FIFA World Cup 2026 → Firestore
 *
 * Cron cada 10 min en GitHub Actions durante el Mundial.
 * Cubre fase de grupos (72 partidos, lookup por nombre de equipo) y
 * fases eliminatorias (32 partidos, lookup por fecha UTC).
 *
 * Para eliminatorias hace DOS cosas:
 *   1. Actualiza homeTeam/awayTeam/flagCodes en cuanto FIFA los tenga
 *      (aunque el partido no se haya jugado aún → el fixture muestra equipos reales)
 *   2. Actualiza homeScore/awayScore + recalcula predicciones al terminar
 *
 * Env requerida: FIREBASE_SERVICE_ACCOUNT_JSON
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ─── Período del Mundial ──────────────────────────────────────────────────────

const WC_START = new Date("2026-06-11T00:00:00Z");
const WC_END   = new Date("2026-07-20T23:59:59Z");

if (process.env.SKIP_DATE_CHECK !== "true" && (new Date() < WC_START || new Date() > WC_END)) {
  console.log("Fuera del período del Mundial, nada que hacer.");
  process.exit(0);
}

// ─── Traducción nombres FIFA → fixture ───────────────────────────────────────

const FIFA_NAMES = {
  "Mexico":             "México",
  "South Africa":       "Sudáfrica",
  "Korea Republic":     "Corea del Sur",
  "Czechia":            "Rep. Checa",
  "Canada":             "Canadá",
  "Bosnia-Herzegovina": "Bosnia Herz.",
  "Qatar":              "Catar",
  "Switzerland":        "Suiza",
  "Brazil":             "Brasil",
  "Morocco":            "Marruecos",
  "Scotland":           "Escocia",
  "Haiti":              "Haití",
  "USA":                "Estados Unidos",
  "Australia":          "Australia",
  "Türkiye":            "Turquía",
  "Paraguay":           "Paraguay",
  "Germany":            "Alemania",
  "Curaçao":            "Curazao",
  "Côte d'Ivoire":      "Costa de Marfil",
  "Ecuador":            "Ecuador",
  "Netherlands":        "Países Bajos",
  "Japan":              "Japón",
  "Sweden":             "Suecia",
  "Tunisia":            "Túnez",
  "Belgium":            "Bélgica",
  "Egypt":              "Egipto",
  "IR Iran":            "Irán",
  "New Zealand":        "Nueva Zelanda",
  "Spain":              "España",
  "Cabo Verde":         "Cabo Verde",
  "Saudi Arabia":       "Arabia Saudí",
  "Uruguay":            "Uruguay",
  "France":             "Francia",
  "Senegal":            "Senegal",
  "Iraq":               "Irak",
  "Norway":             "Noruega",
  "Argentina":          "Argentina",
  "Algeria":            "Argelia",
  "Austria":            "Austria",
  "Jordan":             "Jordania",
  "Portugal":           "Portugal",
  "Uzbekistan":         "Uzbekistán",
  "Congo DR":           "RD Congo",
  "England":            "Inglaterra",
  "Croatia":            "Croacia",
  "Ghana":              "Ghana",
  "Panama":             "Panamá",
  "Colombia":           "Colombia",
};

// ─── Flag codes por nombre de equipo (fixture) ────────────────────────────────

const TEAM_FLAGS = {
  "México":          "mx",
  "Sudáfrica":       "za",
  "Corea del Sur":   "kr",
  "Rep. Checa":      "cz",
  "Canadá":          "ca",
  "Bosnia Herz.":    "ba",
  "Catar":           "qa",
  "Suiza":           "ch",
  "Brasil":          "br",
  "Marruecos":       "ma",
  "Escocia":         "gb-sct",
  "Haití":           "ht",
  "Estados Unidos":  "us",
  "Australia":       "au",
  "Turquía":         "tr",
  "Paraguay":        "py",
  "Alemania":        "de",
  "Curazao":         "cw",
  "Costa de Marfil": "ci",
  "Ecuador":         "ec",
  "Países Bajos":    "nl",
  "Japón":           "jp",
  "Suecia":          "se",
  "Túnez":           "tn",
  "Bélgica":         "be",
  "Egipto":          "eg",
  "Irán":            "ir",
  "Nueva Zelanda":   "nz",
  "España":          "es",
  "Cabo Verde":      "cv",
  "Arabia Saudí":    "sa",
  "Uruguay":         "uy",
  "Francia":         "fr",
  "Senegal":         "sn",
  "Irak":            "iq",
  "Noruega":         "no",
  "Argentina":       "ar",
  "Argelia":         "dz",
  "Austria":         "at",
  "Jordania":        "jo",
  "Portugal":        "pt",
  "Uzbekistán":      "uz",
  "RD Congo":        "cd",
  "Inglaterra":      "gb-eng",
  "Croacia":         "hr",
  "Ghana":           "gh",
  "Panamá":          "pa",
  "Colombia":        "co",
};

// ─── Lookup por nombre (fase de grupos) ──────────────────────────────────────

const FIXTURE_LOOKUP = {
  // Grupo A
  "México|Sudáfrica":          "g_a1",
  "Corea del Sur|Rep. Checa":  "g_a2",
  "Rep. Checa|Sudáfrica":      "g_a3",
  "México|Corea del Sur":      "g_a4",
  "Rep. Checa|México":         "g_a5",
  "Sudáfrica|Corea del Sur":   "g_a6",
  // Grupo B
  "Canadá|Bosnia Herz.":       "g_b1",
  "Catar|Suiza":                "g_b2",
  "Suiza|Bosnia Herz.":        "g_b3",
  "Canadá|Catar":               "g_b4",
  "Suiza|Canadá":               "g_b5",
  "Bosnia Herz.|Catar":        "g_b6",
  // Grupo C
  "Brasil|Marruecos":           "g_c1",
  "Haití|Escocia":              "g_c2",
  "Escocia|Marruecos":          "g_c3",
  "Brasil|Haití":               "g_c4",
  "Escocia|Brasil":             "g_c5",
  "Marruecos|Haití":            "g_c6",
  // Grupo D
  "Estados Unidos|Paraguay":    "g_d1",
  "Australia|Turquía":          "g_d2",
  "Estados Unidos|Australia":   "g_d3",
  "Turquía|Paraguay":           "g_d4",
  "Turquía|Estados Unidos":     "g_d5",
  "Paraguay|Australia":         "g_d6",
  // Grupo E
  "Alemania|Curazao":           "g_e1",
  "Costa de Marfil|Ecuador":    "g_e2",
  "Alemania|Costa de Marfil":   "g_e3",
  "Ecuador|Curazao":            "g_e4",
  "Curazao|Costa de Marfil":    "g_e5",
  "Ecuador|Alemania":           "g_e6",
  // Grupo F
  "Países Bajos|Japón":         "g_f1",
  "Suecia|Túnez":               "g_f2",
  "Países Bajos|Suecia":        "g_f3",
  "Túnez|Japón":                "g_f4",
  "Japón|Suecia":               "g_f5",
  "Túnez|Países Bajos":         "g_f6",
  // Grupo G
  "Bélgica|Egipto":             "g_g1",
  "Irán|Nueva Zelanda":         "g_g2",
  "Bélgica|Irán":               "g_g3",
  "Nueva Zelanda|Egipto":       "g_g4",
  "Egipto|Irán":                "g_g5",
  "Nueva Zelanda|Bélgica":      "g_g6",
  // Grupo H
  "España|Cabo Verde":          "g_h1",
  "Arabia Saudí|Uruguay":       "g_h2",
  "España|Arabia Saudí":        "g_h3",
  "Uruguay|Cabo Verde":         "g_h4",
  "Cabo Verde|Arabia Saudí":    "g_h5",
  "Uruguay|España":             "g_h6",
  // Grupo I
  "Francia|Senegal":            "g_i1",
  "Irak|Noruega":               "g_i2",
  "Francia|Irak":               "g_i3",
  "Noruega|Senegal":            "g_i4",
  "Noruega|Francia":            "g_i5",
  "Senegal|Irak":               "g_i6",
  // Grupo J
  "Argentina|Argelia":          "g_j1",
  "Austria|Jordania":           "g_j2",
  "Argentina|Austria":          "g_j3",
  "Jordania|Argelia":           "g_j4",
  "Argelia|Austria":            "g_j5",
  "Jordania|Argentina":         "g_j6",
  // Grupo K
  "Portugal|RD Congo":          "g_k1",
  "Uzbekistán|Colombia":        "g_k2",
  "Portugal|Uzbekistán":        "g_k3",
  "Colombia|RD Congo":          "g_k4",
  "Colombia|Portugal":          "g_k5",
  "RD Congo|Uzbekistán":        "g_k6",
  // Grupo L
  "Inglaterra|Croacia":         "g_l1",
  "Ghana|Panamá":               "g_l2",
  "Inglaterra|Ghana":           "g_l3",
  "Panamá|Croacia":             "g_l4",
  "Panamá|Inglaterra":          "g_l5",
  "Croacia|Ghana":              "g_l6",
};

// ─── Lookup por fecha UTC (fases eliminatorias) ───────────────────────────────
// Clave: "YYYY-MM-DDTHH:MM" en UTC. Cada partido eliminatorio tiene hora única.

const DATE_LOOKUP = {
  // Ronda de 32 (Dieciseisavos)
  "2026-06-28T22:00": "r32_1",
  "2026-06-29T19:00": "r32_2",
  "2026-06-29T22:00": "r32_3",
  "2026-06-30T01:00": "r32_4",
  "2026-06-30T19:00": "r32_5",
  "2026-06-30T22:00": "r32_6",
  "2026-07-01T01:00": "r32_7",
  "2026-07-01T19:00": "r32_8",
  "2026-07-01T22:00": "r32_9",
  "2026-07-02T01:00": "r32_10",
  "2026-07-02T19:00": "r32_11",
  "2026-07-02T22:00": "r32_12",
  "2026-07-03T01:00": "r32_13",
  "2026-07-03T19:00": "r32_14",
  "2026-07-03T22:00": "r32_15",
  "2026-07-04T01:00": "r32_16",
  // Octavos de final
  "2026-07-04T19:00": "r16_1",
  "2026-07-04T23:00": "r16_2",
  "2026-07-05T19:00": "r16_3",
  "2026-07-05T23:00": "r16_4",
  "2026-07-06T19:00": "r16_5",
  "2026-07-06T23:00": "r16_6",
  "2026-07-07T19:00": "r16_7",
  "2026-07-07T23:00": "r16_8",
  // Cuartos de final
  "2026-07-09T22:00": "qf_1",
  "2026-07-10T22:00": "qf_2",
  "2026-07-11T19:00": "qf_3",
  "2026-07-11T23:00": "qf_4",
  // Semifinales
  "2026-07-14T22:00": "sf_1",
  "2026-07-15T22:00": "sf_2",
  // Tercer puesto
  "2026-07-18T22:00": "3rd",
  // Final
  "2026-07-19T22:00": "final",
};

function fifaDateToUTCKey(dateStr) {
  const d = new Date(dateStr);
  const y   = d.getUTCFullYear();
  const mo  = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h   = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day}T${h}:${min}`;
}

// ─── Scoring (replica src/lib/scoring.ts — mantener sincronizado) ─────────────

const SCORING = {
  group:        { exact: 5, winner_and_diff: 3, winner_only: 2, one_team_goals: 1, miss: 0 },
  round_of_32:  { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
  round_of_16:  { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
  quarterfinal: { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
  semifinal:    { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
  third_place:  { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
  final:        { exact: 8, winner_and_diff: 5, winner_only: 3, one_team_goals: 1, miss: 0 },
};

function getWinner(home, away) {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

function calculateScore(match, pred) {
  const { homeScore: realHome, awayScore: realAway, phase } = match;
  const { homeScore: predHome, awayScore: predAway } = pred;
  if (realHome === null || realAway === null) return { points: 0, reason: "miss" };
  const table = SCORING[phase] ?? SCORING.group;
  if (predHome === realHome && predAway === realAway) return { points: table.exact, reason: "exact" };
  const realWinner = getWinner(realHome, realAway);
  const predWinner = getWinner(predHome, predAway);
  const realDiff   = realHome - realAway;
  const predDiff   = predHome - predAway;
  if (predWinner === realWinner && predDiff === realDiff) return { points: table.winner_and_diff, reason: "winner_and_diff" };
  if (predWinner === realWinner) return { points: table.winner_only, reason: "winner_only" };
  if (predHome === realHome || predAway === realAway) return { points: table.one_team_goals, reason: "one_team_goals" };
  return { points: table.miss, reason: "miss" };
}

// ─── Firebase Admin ───────────────────────────────────────────────────────────

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) { console.error("Falta FIREBASE_SERVICE_ACCOUNT_JSON"); process.exit(1); }

const serviceAccount = JSON.parse(raw);
if (typeof serviceAccount.private_key === "string") {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
}

const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
const db  = getFirestore(app);

// ─── Recalcular predicciones de un partido ────────────────────────────────────

async function recalculateMatch(matchId, match) {
  const predsSnap = await db.collection("predictions").where("matchId", "==", matchId).get();
  if (predsSnap.empty) return 0;

  const batch      = db.batch();
  const userDeltas = {};

  for (const predDoc of predsSnap.docs) {
    const pred = predDoc.data();
    const { points, reason } = calculateScore(match, pred);
    batch.update(predDoc.ref, { points });

    if (!userDeltas[pred.userId]) userDeltas[pred.userId] = { points: 0, partial: 0, exact: 0 };
    userDeltas[pred.userId].points += points - (pred.points ?? 0);
    if (reason === "exact")      userDeltas[pred.userId].exact   += 1;
    else if (reason !== "miss")  userDeltas[pred.userId].partial += 1;
  }

  for (const [uid, delta] of Object.entries(userDeltas)) {
    const userSnap = await db.collection("users").doc(uid).get();
    if (userSnap.exists) {
      const u = userSnap.data();
      batch.update(userSnap.ref, {
        totalPoints:  (u.totalPoints  || 0) + delta.points,
        partialCount: (u.partialCount || 0) + delta.partial,
        exactCount:   (u.exactCount   || 0) + delta.exact,
      });
    }
  }

  await batch.commit();
  return predsSnap.size;
}

// ─── Fetch FIFA ───────────────────────────────────────────────────────────────

const FIFA_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
  "Accept":     "application/json, text/plain, */*",
  "Referer":    "https://www.fifa.com/",
  "Origin":     "https://www.fifa.com",
};

async function fetchFIFAMatches() {
  const URL = "https://api.fifa.com/api/v3/calendar/matches?language=es&count=500&idSeason=285023";
  const res = await fetch(URL, { headers: FIFA_HEADERS });
  if (!res.ok) throw new Error(`FIFA API falló: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.Results)) throw new Error(`Estructura inesperada: keys=${Object.keys(data).join(",")}`);
  return data.Results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[${new Date().toISOString()}] Sync FIFA World Cup 2026...`);

  const fifaMatches = await fetchFIFAMatches();
  console.log(`Partidos en API: ${fifaMatches.length}`);

  let resultsUpdated = 0;
  let teamsUpdated   = 0;
  let skipped        = 0;
  let unknown        = 0;

  for (const m of fifaMatches) {
    const homeNameEn = m.Home?.ShortClubName;
    const awayNameEn = m.Away?.ShortClubName;
    if (!homeNameEn || !awayNameEn) continue;

    const homeFixture = FIFA_NAMES[homeNameEn] ?? homeNameEn;
    const awayFixture = FIFA_NAMES[awayNameEn] ?? awayNameEn;

    // 1. Lookup por nombre (fase de grupos)
    let matchId       = FIXTURE_LOOKUP[`${homeFixture}|${awayFixture}`];
    let isElimination = false;

    // 2. Fallback: lookup por fecha UTC (fases eliminatorias)
    if (!matchId && m.Date) {
      const dateKey = fifaDateToUTCKey(m.Date);
      matchId = DATE_LOOKUP[dateKey];
      if (matchId) isElimination = true;
    }

    if (!matchId) {
      // Loguear siempre (incluso sin resultado) para diagnosticar nombres no reconocidos
      console.warn(`  ⚠ Sin matchId: "${homeNameEn}" vs "${awayNameEn}" (${m.Date})`);
      if (m.HomeTeamScore !== null) unknown++;
      continue;
    }

    const matchRef  = db.collection("matches").doc(matchId);
    const matchSnap = await matchRef.get();
    if (!matchSnap.exists) {
      console.warn(`  ⚠ ${matchId} no está en Firestore — ¿se seedeó el fixture?`);
      continue;
    }

    const current = matchSnap.data();
    const updates = {};

    // Para eliminatorias: actualizar nombres/banderas en cuanto FIFA los tenga
    // (incluso si el partido aún no se jugó → el fixture muestra equipos reales)
    if (isElimination) {
      if (current.homeTeam !== homeFixture) updates.homeTeam = homeFixture;
      if (current.awayTeam !== awayFixture) updates.awayTeam = awayFixture;
      const homeFlag = TEAM_FLAGS[homeFixture];
      const awayFlag = TEAM_FLAGS[awayFixture];
      if (homeFlag && current.homeFlagCode !== homeFlag) updates.homeFlagCode = homeFlag;
      if (awayFlag && current.awayFlagCode !== awayFlag) updates.awayFlagCode = awayFlag;
    }

    // Para todos: actualizar resultado si hay score nuevo
    const hasResult     = m.HomeTeamScore !== null && m.AwayTeamScore !== null;
    const resultChanged = current.homeScore !== m.HomeTeamScore || current.awayScore !== m.AwayTeamScore;

    if (hasResult && resultChanged) {
      updates.homeScore = m.HomeTeamScore;
      updates.awayScore = m.AwayTeamScore;
    }

    if (Object.keys(updates).length === 0) {
      skipped++;
      continue;
    }

    await matchRef.update(updates);

    if (hasResult && resultChanged) {
      const updatedMatch = { ...current, ...updates };
      const predCount    = await recalculateMatch(matchId, updatedMatch);
      console.log(
        `  ✓ [resultado] ${matchId}: ${homeNameEn} ${m.HomeTeamScore}-${m.AwayTeamScore} ${awayNameEn}` +
        ` (${predCount} predicciones)`
      );
      resultsUpdated++;
    } else {
      console.log(`  → [equipos]   ${matchId}: ${homeFixture} vs ${awayFixture}`);
      teamsUpdated++;
    }
  }

  console.log(
    `\nResumen: ${resultsUpdated} resultados, ${teamsUpdated} equipos actualizados, ` +
    `${skipped} sin cambios, ${unknown} no encontrados`
  );
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
