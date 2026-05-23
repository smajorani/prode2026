import { Match } from "@/types";

// Fixture completo FIFA World Cup 2026 — fuente: FIFA oficial (fifa.com)
// Horarios en UTC. Los del fixture oficial están en Eastern US (UTC-4), +4h para convertir a UTC.
export const FIXTURE: Omit<Match, "homeScore" | "awayScore">[] = [
  // ── FASE DE GRUPOS ────────────────────────────────────────────────────────

  // Grupo A: México, Sudáfrica, Corea del Sur, Rep. Checa
  { id: "g_a1", date: "2026-06-11T19:00:00Z", homeTeam: "México",        awayTeam: "Sudáfrica",    homeFlagCode: "mx", awayFlagCode: "za",     phase: "group", group: "A", venue: "Estadio Ciudad de México", city: "Ciudad de México" },
  { id: "g_a2", date: "2026-06-12T02:00:00Z", homeTeam: "Corea del Sur", awayTeam: "Rep. Checa",   homeFlagCode: "kr", awayFlagCode: "cz",     phase: "group", group: "A", venue: "Estadio Akron",            city: "Guadalajara" },
  { id: "g_a3", date: "2026-06-18T16:00:00Z", homeTeam: "Rep. Checa",    awayTeam: "Sudáfrica",    homeFlagCode: "cz", awayFlagCode: "za",     phase: "group", group: "A", venue: "Mercedes-Benz Stadium",    city: "Atlanta" },
  { id: "g_a4", date: "2026-06-19T01:00:00Z", homeTeam: "México",        awayTeam: "Corea del Sur", homeFlagCode: "mx", awayFlagCode: "kr",    phase: "group", group: "A", venue: "Estadio Akron",            city: "Guadalajara" },
  { id: "g_a5", date: "2026-06-25T01:00:00Z", homeTeam: "Rep. Checa",    awayTeam: "México",       homeFlagCode: "cz", awayFlagCode: "mx",     phase: "group", group: "A", venue: "Estadio Ciudad de México", city: "Ciudad de México" },
  { id: "g_a6", date: "2026-06-25T01:00:00Z", homeTeam: "Sudáfrica",     awayTeam: "Corea del Sur", homeFlagCode: "za", awayFlagCode: "kr",    phase: "group", group: "A", venue: "Estadio BBVA",             city: "Monterrey" },

  // Grupo B: Canadá, Bosnia Herz., Catar, Suiza
  { id: "g_b1", date: "2026-06-12T19:00:00Z", homeTeam: "Canadá",        awayTeam: "Bosnia Herz.", homeFlagCode: "ca", awayFlagCode: "ba",     phase: "group", group: "B", venue: "BMO Field",                city: "Toronto" },
  { id: "g_b2", date: "2026-06-13T19:00:00Z", homeTeam: "Catar",         awayTeam: "Suiza",        homeFlagCode: "qa", awayFlagCode: "ch",     phase: "group", group: "B", venue: "Levi's Stadium",           city: "San Francisco" },
  { id: "g_b3", date: "2026-06-18T19:00:00Z", homeTeam: "Suiza",         awayTeam: "Bosnia Herz.", homeFlagCode: "ch", awayFlagCode: "ba",     phase: "group", group: "B", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "g_b4", date: "2026-06-18T22:00:00Z", homeTeam: "Canadá",        awayTeam: "Catar",        homeFlagCode: "ca", awayFlagCode: "qa",     phase: "group", group: "B", venue: "BC Place",                 city: "Vancouver" },
  { id: "g_b5", date: "2026-06-24T19:00:00Z", homeTeam: "Suiza",         awayTeam: "Canadá",       homeFlagCode: "ch", awayFlagCode: "ca",     phase: "group", group: "B", venue: "BC Place",                 city: "Vancouver" },
  { id: "g_b6", date: "2026-06-24T19:00:00Z", homeTeam: "Bosnia Herz.",  awayTeam: "Catar",        homeFlagCode: "ba", awayFlagCode: "qa",     phase: "group", group: "B", venue: "Lumen Field",              city: "Seattle" },

  // Grupo C: Brasil, Marruecos, Haití, Escocia
  { id: "g_c1", date: "2026-06-13T22:00:00Z", homeTeam: "Brasil",        awayTeam: "Marruecos",    homeFlagCode: "br", awayFlagCode: "ma",     phase: "group", group: "C", venue: "MetLife Stadium",          city: "New York" },
  { id: "g_c2", date: "2026-06-14T01:00:00Z", homeTeam: "Haití",         awayTeam: "Escocia",      homeFlagCode: "ht", awayFlagCode: "gb-sct", phase: "group", group: "C", venue: "Gillette Stadium",         city: "Boston" },
  { id: "g_c3", date: "2026-06-19T22:00:00Z", homeTeam: "Escocia",       awayTeam: "Marruecos",    homeFlagCode: "gb-sct", awayFlagCode: "ma", phase: "group", group: "C", venue: "Gillette Stadium",         city: "Boston" },
  { id: "g_c4", date: "2026-06-20T01:00:00Z", homeTeam: "Brasil",        awayTeam: "Haití",        homeFlagCode: "br", awayFlagCode: "ht",     phase: "group", group: "C", venue: "Lincoln Financial Field",  city: "Philadelphia" },
  { id: "g_c5", date: "2026-06-24T22:00:00Z", homeTeam: "Escocia",       awayTeam: "Brasil",       homeFlagCode: "gb-sct", awayFlagCode: "br", phase: "group", group: "C", venue: "Hard Rock Stadium",        city: "Miami" },
  { id: "g_c6", date: "2026-06-24T22:00:00Z", homeTeam: "Marruecos",     awayTeam: "Haití",        homeFlagCode: "ma", awayFlagCode: "ht",     phase: "group", group: "C", venue: "Mercedes-Benz Stadium",   city: "Atlanta" },

  // Grupo D: Estados Unidos, Paraguay, Australia, Turquía
  { id: "g_d1", date: "2026-06-13T01:00:00Z", homeTeam: "Estados Unidos", awayTeam: "Paraguay",   homeFlagCode: "us", awayFlagCode: "py",     phase: "group", group: "D", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "g_d2", date: "2026-06-14T04:00:00Z", homeTeam: "Australia",      awayTeam: "Turquía",    homeFlagCode: "au", awayFlagCode: "tr",     phase: "group", group: "D", venue: "BC Place",                 city: "Vancouver" },
  { id: "g_d3", date: "2026-06-19T19:00:00Z", homeTeam: "Estados Unidos", awayTeam: "Australia",  homeFlagCode: "us", awayFlagCode: "au",     phase: "group", group: "D", venue: "Lumen Field",              city: "Seattle" },
  { id: "g_d4", date: "2026-06-20T04:00:00Z", homeTeam: "Turquía",        awayTeam: "Paraguay",   homeFlagCode: "tr", awayFlagCode: "py",     phase: "group", group: "D", venue: "Levi's Stadium",           city: "San Francisco" },
  { id: "g_d5", date: "2026-06-26T02:00:00Z", homeTeam: "Turquía",        awayTeam: "Estados Unidos", homeFlagCode: "tr", awayFlagCode: "us", phase: "group", group: "D", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "g_d6", date: "2026-06-26T02:00:00Z", homeTeam: "Paraguay",       awayTeam: "Australia",  homeFlagCode: "py", awayFlagCode: "au",     phase: "group", group: "D", venue: "Levi's Stadium",           city: "San Francisco" },

  // Grupo E: Alemania, Curazao, Costa de Marfil, Ecuador
  { id: "g_e1", date: "2026-06-14T17:00:00Z", homeTeam: "Alemania",       awayTeam: "Curazao",       homeFlagCode: "de", awayFlagCode: "cw", phase: "group", group: "E", venue: "NRG Stadium",              city: "Houston" },
  { id: "g_e2", date: "2026-06-14T23:00:00Z", homeTeam: "Costa de Marfil", awayTeam: "Ecuador",      homeFlagCode: "ci", awayFlagCode: "ec", phase: "group", group: "E", venue: "Lincoln Financial Field",  city: "Philadelphia" },
  { id: "g_e3", date: "2026-06-20T20:00:00Z", homeTeam: "Alemania",       awayTeam: "Costa de Marfil", homeFlagCode: "de", awayFlagCode: "ci", phase: "group", group: "E", venue: "BMO Field",            city: "Toronto" },
  { id: "g_e4", date: "2026-06-21T02:00:00Z", homeTeam: "Ecuador",        awayTeam: "Curazao",       homeFlagCode: "ec", awayFlagCode: "cw", phase: "group", group: "E", venue: "Arrowhead Stadium",        city: "Kansas City" },
  { id: "g_e5", date: "2026-06-25T20:00:00Z", homeTeam: "Curazao",        awayTeam: "Costa de Marfil", homeFlagCode: "cw", awayFlagCode: "ci", phase: "group", group: "E", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "g_e6", date: "2026-06-25T20:00:00Z", homeTeam: "Ecuador",        awayTeam: "Alemania",      homeFlagCode: "ec", awayFlagCode: "de", phase: "group", group: "E", venue: "MetLife Stadium",           city: "New York" },

  // Grupo F: Países Bajos, Japón, Suecia, Túnez
  { id: "g_f1", date: "2026-06-14T20:00:00Z", homeTeam: "Países Bajos",  awayTeam: "Japón",        homeFlagCode: "nl", awayFlagCode: "jp",     phase: "group", group: "F", venue: "AT&T Stadium",             city: "Dallas" },
  { id: "g_f2", date: "2026-06-15T02:00:00Z", homeTeam: "Suecia",        awayTeam: "Túnez",        homeFlagCode: "se", awayFlagCode: "tn",     phase: "group", group: "F", venue: "Estadio BBVA",             city: "Monterrey" },
  { id: "g_f3", date: "2026-06-20T17:00:00Z", homeTeam: "Países Bajos",  awayTeam: "Suecia",       homeFlagCode: "nl", awayFlagCode: "se",     phase: "group", group: "F", venue: "NRG Stadium",              city: "Houston" },
  { id: "g_f4", date: "2026-06-21T04:00:00Z", homeTeam: "Túnez",         awayTeam: "Japón",        homeFlagCode: "tn", awayFlagCode: "jp",     phase: "group", group: "F", venue: "Estadio BBVA",             city: "Monterrey" },
  { id: "g_f5", date: "2026-06-25T23:00:00Z", homeTeam: "Japón",         awayTeam: "Suecia",       homeFlagCode: "jp", awayFlagCode: "se",     phase: "group", group: "F", venue: "AT&T Stadium",             city: "Dallas" },
  { id: "g_f6", date: "2026-06-25T23:00:00Z", homeTeam: "Túnez",         awayTeam: "Países Bajos", homeFlagCode: "tn", awayFlagCode: "nl",     phase: "group", group: "F", venue: "Arrowhead Stadium",        city: "Kansas City" },

  // Grupo G: Bélgica, Egipto, Irán, Nueva Zelanda
  { id: "g_g1", date: "2026-06-15T19:00:00Z", homeTeam: "Bélgica",       awayTeam: "Egipto",       homeFlagCode: "be", awayFlagCode: "eg",     phase: "group", group: "G", venue: "Lumen Field",              city: "Seattle" },
  { id: "g_g2", date: "2026-06-16T01:00:00Z", homeTeam: "Irán",          awayTeam: "Nueva Zelanda", homeFlagCode: "ir", awayFlagCode: "nz",   phase: "group", group: "G", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "g_g3", date: "2026-06-21T19:00:00Z", homeTeam: "Bélgica",       awayTeam: "Irán",         homeFlagCode: "be", awayFlagCode: "ir",     phase: "group", group: "G", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "g_g4", date: "2026-06-22T01:00:00Z", homeTeam: "Nueva Zelanda", awayTeam: "Egipto",       homeFlagCode: "nz", awayFlagCode: "eg",     phase: "group", group: "G", venue: "BC Place",                 city: "Vancouver" },
  { id: "g_g5", date: "2026-06-27T03:00:00Z", homeTeam: "Egipto",        awayTeam: "Irán",         homeFlagCode: "eg", awayFlagCode: "ir",     phase: "group", group: "G", venue: "Lumen Field",              city: "Seattle" },
  { id: "g_g6", date: "2026-06-27T03:00:00Z", homeTeam: "Nueva Zelanda", awayTeam: "Bélgica",      homeFlagCode: "nz", awayFlagCode: "be",     phase: "group", group: "G", venue: "BC Place",                 city: "Vancouver" },

  // Grupo H: España, Cabo Verde, Arabia Saudí, Uruguay
  { id: "g_h1", date: "2026-06-15T16:00:00Z", homeTeam: "España",        awayTeam: "Cabo Verde",   homeFlagCode: "es", awayFlagCode: "cv",     phase: "group", group: "H", venue: "Mercedes-Benz Stadium",    city: "Atlanta" },
  { id: "g_h2", date: "2026-06-15T22:00:00Z", homeTeam: "Arabia Saudí",  awayTeam: "Uruguay",      homeFlagCode: "sa", awayFlagCode: "uy",     phase: "group", group: "H", venue: "Hard Rock Stadium",        city: "Miami" },
  { id: "g_h3", date: "2026-06-21T16:00:00Z", homeTeam: "España",        awayTeam: "Arabia Saudí", homeFlagCode: "es", awayFlagCode: "sa",     phase: "group", group: "H", venue: "Mercedes-Benz Stadium",    city: "Atlanta" },
  { id: "g_h4", date: "2026-06-21T22:00:00Z", homeTeam: "Uruguay",       awayTeam: "Cabo Verde",   homeFlagCode: "uy", awayFlagCode: "cv",     phase: "group", group: "H", venue: "Hard Rock Stadium",        city: "Miami" },
  { id: "g_h5", date: "2026-06-27T00:00:00Z", homeTeam: "Cabo Verde",    awayTeam: "Arabia Saudí", homeFlagCode: "cv", awayFlagCode: "sa",     phase: "group", group: "H", venue: "NRG Stadium",              city: "Houston" },
  { id: "g_h6", date: "2026-06-27T00:00:00Z", homeTeam: "Uruguay",       awayTeam: "España",       homeFlagCode: "uy", awayFlagCode: "es",     phase: "group", group: "H", venue: "Estadio Akron",            city: "Guadalajara" },

  // Grupo I: Francia, Senegal, Irak, Noruega
  { id: "g_i1", date: "2026-06-16T19:00:00Z", homeTeam: "Francia",       awayTeam: "Senegal",      homeFlagCode: "fr", awayFlagCode: "sn",     phase: "group", group: "I", venue: "MetLife Stadium",          city: "New York" },
  { id: "g_i2", date: "2026-06-16T22:00:00Z", homeTeam: "Irak",          awayTeam: "Noruega",      homeFlagCode: "iq", awayFlagCode: "no",     phase: "group", group: "I", venue: "Gillette Stadium",         city: "Boston" },
  { id: "g_i3", date: "2026-06-22T21:00:00Z", homeTeam: "Francia",       awayTeam: "Irak",         homeFlagCode: "fr", awayFlagCode: "iq",     phase: "group", group: "I", venue: "Lincoln Financial Field",  city: "Philadelphia" },
  { id: "g_i4", date: "2026-06-23T00:00:00Z", homeTeam: "Noruega",       awayTeam: "Senegal",      homeFlagCode: "no", awayFlagCode: "sn",     phase: "group", group: "I", venue: "MetLife Stadium",          city: "New York" },
  { id: "g_i5", date: "2026-06-26T19:00:00Z", homeTeam: "Noruega",       awayTeam: "Francia",      homeFlagCode: "no", awayFlagCode: "fr",     phase: "group", group: "I", venue: "Gillette Stadium",         city: "Boston" },
  { id: "g_i6", date: "2026-06-26T19:00:00Z", homeTeam: "Senegal",       awayTeam: "Irak",         homeFlagCode: "sn", awayFlagCode: "iq",     phase: "group", group: "I", venue: "BMO Field",                city: "Toronto" },

  // Grupo J: Argentina, Argelia, Austria, Jordania
  { id: "g_j1", date: "2026-06-17T01:00:00Z", homeTeam: "Argentina",     awayTeam: "Argelia",      homeFlagCode: "ar", awayFlagCode: "dz",     phase: "group", group: "J", venue: "Arrowhead Stadium",        city: "Kansas City" },
  { id: "g_j2", date: "2026-06-17T04:00:00Z", homeTeam: "Austria",       awayTeam: "Jordania",     homeFlagCode: "at", awayFlagCode: "jo",     phase: "group", group: "J", venue: "Levi's Stadium",           city: "San Francisco" },
  { id: "g_j3", date: "2026-06-22T17:00:00Z", homeTeam: "Argentina",     awayTeam: "Austria",      homeFlagCode: "ar", awayFlagCode: "at",     phase: "group", group: "J", venue: "AT&T Stadium",             city: "Dallas" },
  { id: "g_j4", date: "2026-06-23T03:00:00Z", homeTeam: "Jordania",      awayTeam: "Argelia",      homeFlagCode: "jo", awayFlagCode: "dz",     phase: "group", group: "J", venue: "Levi's Stadium",           city: "San Francisco" },
  { id: "g_j5", date: "2026-06-28T02:00:00Z", homeTeam: "Argelia",       awayTeam: "Austria",      homeFlagCode: "dz", awayFlagCode: "at",     phase: "group", group: "J", venue: "Arrowhead Stadium",        city: "Kansas City" },
  { id: "g_j6", date: "2026-06-28T02:00:00Z", homeTeam: "Jordania",      awayTeam: "Argentina",    homeFlagCode: "jo", awayFlagCode: "ar",     phase: "group", group: "J", venue: "AT&T Stadium",             city: "Dallas" },

  // Grupo K: Portugal, RD Congo, Uzbekistán, Colombia
  { id: "g_k1", date: "2026-06-17T17:00:00Z", homeTeam: "Portugal",      awayTeam: "RD Congo",     homeFlagCode: "pt", awayFlagCode: "cd",     phase: "group", group: "K", venue: "NRG Stadium",              city: "Houston" },
  { id: "g_k2", date: "2026-06-18T02:00:00Z", homeTeam: "Uzbekistán",    awayTeam: "Colombia",     homeFlagCode: "uz", awayFlagCode: "co",     phase: "group", group: "K", venue: "Estadio Ciudad de México", city: "Ciudad de México" },
  { id: "g_k3", date: "2026-06-23T17:00:00Z", homeTeam: "Portugal",      awayTeam: "Uzbekistán",   homeFlagCode: "pt", awayFlagCode: "uz",     phase: "group", group: "K", venue: "NRG Stadium",              city: "Houston" },
  { id: "g_k4", date: "2026-06-24T02:00:00Z", homeTeam: "Colombia",      awayTeam: "RD Congo",     homeFlagCode: "co", awayFlagCode: "cd",     phase: "group", group: "K", venue: "Estadio Akron",            city: "Guadalajara" },
  { id: "g_k5", date: "2026-06-27T23:30:00Z", homeTeam: "Colombia",      awayTeam: "Portugal",     homeFlagCode: "co", awayFlagCode: "pt",     phase: "group", group: "K", venue: "Hard Rock Stadium",        city: "Miami" },
  { id: "g_k6", date: "2026-06-27T23:30:00Z", homeTeam: "RD Congo",      awayTeam: "Uzbekistán",   homeFlagCode: "cd", awayFlagCode: "uz",     phase: "group", group: "K", venue: "Mercedes-Benz Stadium",    city: "Atlanta" },

  // Grupo L: Inglaterra, Croacia, Ghana, Panamá
  { id: "g_l1", date: "2026-06-17T20:00:00Z", homeTeam: "Inglaterra",    awayTeam: "Croacia",      homeFlagCode: "gb-eng", awayFlagCode: "hr", phase: "group", group: "L", venue: "AT&T Stadium",             city: "Dallas" },
  { id: "g_l2", date: "2026-06-17T23:00:00Z", homeTeam: "Ghana",         awayTeam: "Panamá",       homeFlagCode: "gh", awayFlagCode: "pa",     phase: "group", group: "L", venue: "BMO Field",                city: "Toronto" },
  { id: "g_l3", date: "2026-06-23T20:00:00Z", homeTeam: "Inglaterra",    awayTeam: "Ghana",        homeFlagCode: "gb-eng", awayFlagCode: "gh", phase: "group", group: "L", venue: "Gillette Stadium",         city: "Boston" },
  { id: "g_l4", date: "2026-06-23T23:00:00Z", homeTeam: "Panamá",        awayTeam: "Croacia",      homeFlagCode: "pa", awayFlagCode: "hr",     phase: "group", group: "L", venue: "BMO Field",                city: "Toronto" },
  { id: "g_l5", date: "2026-06-27T21:00:00Z", homeTeam: "Panamá",        awayTeam: "Inglaterra",   homeFlagCode: "pa", awayFlagCode: "gb-eng", phase: "group", group: "L", venue: "MetLife Stadium",          city: "New York" },
  { id: "g_l6", date: "2026-06-27T21:00:00Z", homeTeam: "Croacia",       awayTeam: "Ghana",        homeFlagCode: "hr", awayFlagCode: "gh",     phase: "group", group: "L", venue: "Lincoln Financial Field",  city: "Philadelphia" },

  // ── RONDA DE 32 (P73–P88) ────────────────────────────────────────────────
  { id: "r32_1",  date: "2026-06-28T22:00:00Z", homeTeam: "2° Grupo A",    awayTeam: "2° Grupo B",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "r32_2",  date: "2026-06-29T19:00:00Z", homeTeam: "1° Grupo E",    awayTeam: "3° A/B/C/D/F",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Gillette Stadium",         city: "Boston" },
  { id: "r32_3",  date: "2026-06-29T22:00:00Z", homeTeam: "1° Grupo F",    awayTeam: "2° Grupo C",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Estadio BBVA",             city: "Monterrey" },
  { id: "r32_4",  date: "2026-06-30T01:00:00Z", homeTeam: "1° Grupo C",    awayTeam: "2° Grupo F",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "NRG Stadium",              city: "Houston" },
  { id: "r32_5",  date: "2026-06-30T19:00:00Z", homeTeam: "1° Grupo I",    awayTeam: "3° C/D/F/G/H",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "MetLife Stadium",          city: "New York" },
  { id: "r32_6",  date: "2026-06-30T22:00:00Z", homeTeam: "2° Grupo E",    awayTeam: "2° Grupo I",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "AT&T Stadium",             city: "Dallas" },
  { id: "r32_7",  date: "2026-07-01T01:00:00Z", homeTeam: "1° Grupo A",    awayTeam: "3° C/E/F/H/I",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Estadio Ciudad de México", city: "Ciudad de México" },
  { id: "r32_8",  date: "2026-07-01T19:00:00Z", homeTeam: "1° Grupo L",    awayTeam: "3° E/H/I/J/K",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Mercedes-Benz Stadium",    city: "Atlanta" },
  { id: "r32_9",  date: "2026-07-01T22:00:00Z", homeTeam: "1° Grupo D",    awayTeam: "3° B/E/F/I/J",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Levi's Stadium",           city: "San Francisco" },
  { id: "r32_10", date: "2026-07-02T01:00:00Z", homeTeam: "1° Grupo G",    awayTeam: "3° A/E/H/I/J",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Lumen Field",              city: "Seattle" },
  { id: "r32_11", date: "2026-07-02T19:00:00Z", homeTeam: "2° Grupo K",    awayTeam: "2° Grupo L",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "BMO Field",                city: "Toronto" },
  { id: "r32_12", date: "2026-07-02T22:00:00Z", homeTeam: "1° Grupo H",    awayTeam: "2° Grupo J",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "SoFi Stadium",             city: "Los Ángeles" },
  { id: "r32_13", date: "2026-07-03T01:00:00Z", homeTeam: "1° Grupo B",    awayTeam: "3° E/F/G/I/J",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "BC Place",                 city: "Vancouver" },
  { id: "r32_14", date: "2026-07-03T19:00:00Z", homeTeam: "1° Grupo J",    awayTeam: "2° Grupo H",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Hard Rock Stadium",        city: "Miami" },
  { id: "r32_15", date: "2026-07-03T22:00:00Z", homeTeam: "1° Grupo K",    awayTeam: "3° D/E/I/J/L",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Arrowhead Stadium",        city: "Kansas City" },
  { id: "r32_16", date: "2026-07-04T01:00:00Z", homeTeam: "2° Grupo D",    awayTeam: "2° Grupo G",    homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "AT&T Stadium",             city: "Dallas" },

  // ── OCTAVOS DE FINAL (P89–P96) ───────────────────────────────────────────
  { id: "r16_1", date: "2026-07-04T19:00:00Z", homeTeam: "W r32_2",  awayTeam: "W r32_5",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "r16_2", date: "2026-07-04T23:00:00Z", homeTeam: "W r32_1",  awayTeam: "W r32_3",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "NRG Stadium",             city: "Houston" },
  { id: "r16_3", date: "2026-07-05T19:00:00Z", homeTeam: "W r32_4",  awayTeam: "W r32_6",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "MetLife Stadium",         city: "New York" },
  { id: "r16_4", date: "2026-07-05T23:00:00Z", homeTeam: "W r32_7",  awayTeam: "W r32_8",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Estadio Ciudad de México", city: "Ciudad de México" },
  { id: "r16_5", date: "2026-07-06T19:00:00Z", homeTeam: "W r32_11", awayTeam: "W r32_12", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "AT&T Stadium",            city: "Dallas" },
  { id: "r16_6", date: "2026-07-06T23:00:00Z", homeTeam: "W r32_9",  awayTeam: "W r32_10", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Lumen Field",             city: "Seattle" },
  { id: "r16_7", date: "2026-07-07T19:00:00Z", homeTeam: "W r32_14", awayTeam: "W r32_16", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Mercedes-Benz Stadium",   city: "Atlanta" },
  { id: "r16_8", date: "2026-07-07T23:00:00Z", homeTeam: "W r32_13", awayTeam: "W r32_15", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "BC Place",                city: "Vancouver" },

  // ── CUARTOS DE FINAL (P97–P100) ──────────────────────────────────────────
  { id: "qf_1", date: "2026-07-09T22:00:00Z", homeTeam: "W r16_1", awayTeam: "W r16_2", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "Gillette Stadium",  city: "Boston" },
  { id: "qf_2", date: "2026-07-10T22:00:00Z", homeTeam: "W r16_5", awayTeam: "W r16_6", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "SoFi Stadium",      city: "Los Ángeles" },
  { id: "qf_3", date: "2026-07-11T19:00:00Z", homeTeam: "W r16_3", awayTeam: "W r16_4", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "qf_4", date: "2026-07-11T23:00:00Z", homeTeam: "W r16_7", awayTeam: "W r16_8", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "Arrowhead Stadium", city: "Kansas City" },

  // ── SEMIFINALES (P101–P102) ───────────────────────────────────────────────
  { id: "sf_1", date: "2026-07-14T22:00:00Z", homeTeam: "W qf_1", awayTeam: "W qf_2", homeFlagCode: "", awayFlagCode: "", phase: "semifinal", venue: "AT&T Stadium",           city: "Dallas" },
  { id: "sf_2", date: "2026-07-15T22:00:00Z", homeTeam: "W qf_3", awayTeam: "W qf_4", homeFlagCode: "", awayFlagCode: "", phase: "semifinal", venue: "Mercedes-Benz Stadium",  city: "Atlanta" },

  // ── TERCER PUESTO (P103) ──────────────────────────────────────────────────
  { id: "3rd",   date: "2026-07-18T22:00:00Z", homeTeam: "L sf_1", awayTeam: "L sf_2", homeFlagCode: "", awayFlagCode: "", phase: "third_place", venue: "Hard Rock Stadium", city: "Miami" },

  // ── FINAL (P104) ──────────────────────────────────────────────────────────
  { id: "final", date: "2026-07-19T22:00:00Z", homeTeam: "W sf_1", awayTeam: "W sf_2", homeFlagCode: "", awayFlagCode: "", phase: "final", venue: "MetLife Stadium", city: "New York" },
];
