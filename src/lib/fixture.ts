import { Match } from "@/types";

// Fixture completo FIFA World Cup 2026
// Horarios en UTC. Ciudades sede: Ciudad de México, Los Angeles, Dallas, San Francisco,
// Seattle, Vancouver, Kansas City, Guadalajara, Monterrey, Toronto, Boston, Miami, New York, Philadelphia, Atlanta
export const FIXTURE: Omit<Match, "homeScore" | "awayScore">[] = [
  // ── FASE DE GRUPOS ────────────────────────────────────────────────────────

  // Grupo A
  { id: "g_a1", date: "2026-06-11T02:00:00Z", homeTeam: "México", awayTeam: "Ecuador", homeFlagCode: "mx", awayFlagCode: "ec", phase: "group", group: "A", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_a2", date: "2026-06-11T22:00:00Z", homeTeam: "Uruguay", awayTeam: "Argentina", homeFlagCode: "uy", awayFlagCode: "ar", phase: "group", group: "A", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "g_a3", date: "2026-06-15T22:00:00Z", homeTeam: "México", awayTeam: "Uruguay", homeFlagCode: "mx", awayFlagCode: "uy", phase: "group", group: "A", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_a4", date: "2026-06-15T18:00:00Z", homeTeam: "Argentina", awayTeam: "Ecuador", homeFlagCode: "ar", awayFlagCode: "ec", phase: "group", group: "A", venue: "AT&T Stadium", city: "Dallas" },
  { id: "g_a5", date: "2026-06-19T22:00:00Z", homeTeam: "Ecuador", awayTeam: "Uruguay", homeFlagCode: "ec", awayFlagCode: "uy", phase: "group", group: "A", venue: "Levi's Stadium", city: "San Francisco" },
  { id: "g_a6", date: "2026-06-19T22:00:00Z", homeTeam: "Argentina", awayTeam: "México", homeFlagCode: "ar", awayFlagCode: "mx", phase: "group", group: "A", venue: "Estadio Azteca", city: "Ciudad de México" },

  // Grupo B
  { id: "g_b1", date: "2026-06-12T02:00:00Z", homeTeam: "España", awayTeam: "Marruecos", homeFlagCode: "es", awayFlagCode: "ma", phase: "group", group: "B", venue: "Lumen Field", city: "Seattle" },
  { id: "g_b2", date: "2026-06-12T18:00:00Z", homeTeam: "Croacia", awayTeam: "Senegal", homeFlagCode: "hr", awayFlagCode: "sn", phase: "group", group: "B", venue: "BC Place", city: "Vancouver" },
  { id: "g_b3", date: "2026-06-16T18:00:00Z", homeTeam: "España", awayTeam: "Croacia", homeFlagCode: "es", awayFlagCode: "hr", phase: "group", group: "B", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "g_b4", date: "2026-06-16T22:00:00Z", homeTeam: "Senegal", awayTeam: "Marruecos", homeFlagCode: "sn", awayFlagCode: "ma", phase: "group", group: "B", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "g_b5", date: "2026-06-20T22:00:00Z", homeTeam: "Croacia", awayTeam: "Marruecos", homeFlagCode: "hr", awayFlagCode: "ma", phase: "group", group: "B", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "g_b6", date: "2026-06-20T22:00:00Z", homeTeam: "Senegal", awayTeam: "España", homeFlagCode: "sn", awayFlagCode: "es", phase: "group", group: "B", venue: "BMO Field", city: "Toronto" },

  // Grupo C
  { id: "g_c1", date: "2026-06-12T22:00:00Z", homeTeam: "Brasil", awayTeam: "Serbia", homeFlagCode: "br", awayFlagCode: "rs", phase: "group", group: "C", venue: "Gillette Stadium", city: "Boston" },
  { id: "g_c2", date: "2026-06-13T02:00:00Z", homeTeam: "Colombia", awayTeam: "Argelia", homeFlagCode: "co", awayFlagCode: "dz", phase: "group", group: "C", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "g_c3", date: "2026-06-17T18:00:00Z", homeTeam: "Brasil", awayTeam: "Colombia", homeFlagCode: "br", awayFlagCode: "co", phase: "group", group: "C", venue: "MetLife Stadium", city: "New York" },
  { id: "g_c4", date: "2026-06-17T22:00:00Z", homeTeam: "Serbia", awayTeam: "Argelia", homeFlagCode: "rs", awayFlagCode: "dz", phase: "group", group: "C", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "g_c5", date: "2026-06-21T22:00:00Z", homeTeam: "Argelia", awayTeam: "Brasil", homeFlagCode: "dz", awayFlagCode: "br", phase: "group", group: "C", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "g_c6", date: "2026-06-21T22:00:00Z", homeTeam: "Colombia", awayTeam: "Serbia", homeFlagCode: "co", awayFlagCode: "rs", phase: "group", group: "C", venue: "SoFi Stadium", city: "Los Angeles" },

  // Grupo D
  { id: "g_d1", date: "2026-06-13T18:00:00Z", homeTeam: "Francia", awayTeam: "Japón", homeFlagCode: "fr", awayFlagCode: "jp", phase: "group", group: "D", venue: "AT&T Stadium", city: "Dallas" },
  { id: "g_d2", date: "2026-06-13T22:00:00Z", homeTeam: "Alemania", awayTeam: "Irán", homeFlagCode: "de", awayFlagCode: "ir", phase: "group", group: "D", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_d3", date: "2026-06-18T02:00:00Z", homeTeam: "Francia", awayTeam: "Alemania", homeFlagCode: "fr", awayFlagCode: "de", phase: "group", group: "D", venue: "Lumen Field", city: "Seattle" },
  { id: "g_d4", date: "2026-06-17T02:00:00Z", homeTeam: "Japón", awayTeam: "Irán", homeFlagCode: "jp", awayFlagCode: "ir", phase: "group", group: "D", venue: "BC Place", city: "Vancouver" },
  { id: "g_d5", date: "2026-06-22T02:00:00Z", homeTeam: "Irán", awayTeam: "Francia", homeFlagCode: "ir", awayFlagCode: "fr", phase: "group", group: "D", venue: "Levi's Stadium", city: "San Francisco" },
  { id: "g_d6", date: "2026-06-22T02:00:00Z", homeTeam: "Alemania", awayTeam: "Japón", homeFlagCode: "de", awayFlagCode: "jp", phase: "group", group: "D", venue: "Arrowhead Stadium", city: "Kansas City" },

  // Grupo E
  { id: "g_e1", date: "2026-06-14T18:00:00Z", homeTeam: "Portugal", awayTeam: "Angola", homeFlagCode: "pt", awayFlagCode: "ao", phase: "group", group: "E", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "g_e2", date: "2026-06-14T22:00:00Z", homeTeam: "Bélgica", awayTeam: "Eslovaquia", homeFlagCode: "be", awayFlagCode: "sk", phase: "group", group: "E", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "g_e3", date: "2026-06-18T18:00:00Z", homeTeam: "Portugal", awayTeam: "Bélgica", homeFlagCode: "pt", awayFlagCode: "be", phase: "group", group: "E", venue: "BMO Field", city: "Toronto" },
  { id: "g_e4", date: "2026-06-18T22:00:00Z", homeTeam: "Eslovaquia", awayTeam: "Angola", homeFlagCode: "sk", awayFlagCode: "ao", phase: "group", group: "E", venue: "Gillette Stadium", city: "Boston" },
  { id: "g_e5", date: "2026-06-22T22:00:00Z", homeTeam: "Angola", awayTeam: "Bélgica", homeFlagCode: "ao", awayFlagCode: "be", phase: "group", group: "E", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "g_e6", date: "2026-06-22T22:00:00Z", homeTeam: "Eslovaquia", awayTeam: "Portugal", homeFlagCode: "sk", awayFlagCode: "pt", phase: "group", group: "E", venue: "MetLife Stadium", city: "New York" },

  // Grupo F
  { id: "g_f1", date: "2026-06-14T02:00:00Z", homeTeam: "Inglaterra", awayTeam: "Camerún", homeFlagCode: "gb-eng", awayFlagCode: "cm", phase: "group", group: "F", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "g_f2", date: "2026-06-15T02:00:00Z", homeTeam: "Países Bajos", awayTeam: "Nigeria", homeFlagCode: "nl", awayFlagCode: "ng", phase: "group", group: "F", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "g_f3", date: "2026-06-19T02:00:00Z", homeTeam: "Inglaterra", awayTeam: "Países Bajos", homeFlagCode: "gb-eng", awayFlagCode: "nl", phase: "group", group: "F", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "g_f4", date: "2026-06-19T02:00:00Z", homeTeam: "Nigeria", awayTeam: "Camerún", homeFlagCode: "ng", awayFlagCode: "cm", phase: "group", group: "F", venue: "AT&T Stadium", city: "Dallas" },
  { id: "g_f5", date: "2026-06-23T22:00:00Z", homeTeam: "Camerún", awayTeam: "Países Bajos", homeFlagCode: "cm", awayFlagCode: "nl", phase: "group", group: "F", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_f6", date: "2026-06-23T22:00:00Z", homeTeam: "Nigeria", awayTeam: "Inglaterra", homeFlagCode: "ng", awayFlagCode: "gb-eng", phase: "group", group: "F", venue: "Lumen Field", city: "Seattle" },

  // Grupo G
  { id: "g_g1", date: "2026-06-15T02:00:00Z", homeTeam: "Estados Unidos", awayTeam: "Bolivia", homeFlagCode: "us", awayFlagCode: "bo", phase: "group", group: "G", venue: "BC Place", city: "Vancouver" },
  { id: "g_g2", date: "2026-06-15T18:00:00Z", homeTeam: "Corea del Sur", awayTeam: "Ghana", homeFlagCode: "kr", awayFlagCode: "gh", phase: "group", group: "G", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "g_g3", date: "2026-06-20T02:00:00Z", homeTeam: "Estados Unidos", awayTeam: "Corea del Sur", homeFlagCode: "us", awayFlagCode: "kr", phase: "group", group: "G", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "g_g4", date: "2026-06-19T18:00:00Z", homeTeam: "Ghana", awayTeam: "Bolivia", homeFlagCode: "gh", awayFlagCode: "bo", phase: "group", group: "G", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "g_g5", date: "2026-06-24T02:00:00Z", homeTeam: "Bolivia", awayTeam: "Corea del Sur", homeFlagCode: "bo", awayFlagCode: "kr", phase: "group", group: "G", venue: "BMO Field", city: "Toronto" },
  { id: "g_g6", date: "2026-06-24T02:00:00Z", homeTeam: "Ghana", awayTeam: "Estados Unidos", homeFlagCode: "gh", awayFlagCode: "us", phase: "group", group: "G", venue: "Gillette Stadium", city: "Boston" },

  // Grupo H
  { id: "g_h1", date: "2026-06-16T02:00:00Z", homeTeam: "Canadá", awayTeam: "Venezuela", homeFlagCode: "ca", awayFlagCode: "ve", phase: "group", group: "H", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "g_h2", date: "2026-06-16T02:00:00Z", homeTeam: "Turquía", awayTeam: "Egipto", homeFlagCode: "tr", awayFlagCode: "eg", phase: "group", group: "H", venue: "MetLife Stadium", city: "New York" },
  { id: "g_h3", date: "2026-06-20T18:00:00Z", homeTeam: "Canadá", awayTeam: "Turquía", homeFlagCode: "ca", awayFlagCode: "tr", phase: "group", group: "H", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "g_h4", date: "2026-06-20T18:00:00Z", homeTeam: "Egipto", awayTeam: "Venezuela", homeFlagCode: "eg", awayFlagCode: "ve", phase: "group", group: "H", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "g_h5", date: "2026-06-24T22:00:00Z", homeTeam: "Venezuela", awayTeam: "Turquía", homeFlagCode: "ve", awayFlagCode: "tr", phase: "group", group: "H", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "g_h6", date: "2026-06-24T22:00:00Z", homeTeam: "Egipto", awayTeam: "Canadá", homeFlagCode: "eg", awayFlagCode: "ca", phase: "group", group: "H", venue: "AT&T Stadium", city: "Dallas" },

  // Grupo I
  { id: "g_i1", date: "2026-06-16T22:00:00Z", homeTeam: "Suiza", awayTeam: "Qatar", homeFlagCode: "ch", awayFlagCode: "qa", phase: "group", group: "I", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_i2", date: "2026-06-17T18:00:00Z", homeTeam: "Italia", awayTeam: "Arabia Saudita", homeFlagCode: "it", awayFlagCode: "sa", phase: "group", group: "I", venue: "Lumen Field", city: "Seattle" },
  { id: "g_i3", date: "2026-06-21T02:00:00Z", homeTeam: "Suiza", awayTeam: "Italia", homeFlagCode: "ch", awayFlagCode: "it", phase: "group", group: "I", venue: "BC Place", city: "Vancouver" },
  { id: "g_i4", date: "2026-06-21T18:00:00Z", homeTeam: "Arabia Saudita", awayTeam: "Qatar", homeFlagCode: "sa", awayFlagCode: "qa", phase: "group", group: "I", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "g_i5", date: "2026-06-25T22:00:00Z", homeTeam: "Qatar", awayTeam: "Italia", homeFlagCode: "qa", awayFlagCode: "it", phase: "group", group: "I", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "g_i6", date: "2026-06-25T22:00:00Z", homeTeam: "Arabia Saudita", awayTeam: "Suiza", homeFlagCode: "sa", awayFlagCode: "ch", phase: "group", group: "I", venue: "Estadio Monterrey", city: "Monterrey" },

  // Grupo J
  { id: "g_j1", date: "2026-06-17T22:00:00Z", homeTeam: "Australia", awayTeam: "Irak", homeFlagCode: "au", awayFlagCode: "iq", phase: "group", group: "J", venue: "BMO Field", city: "Toronto" },
  { id: "g_j2", date: "2026-06-18T02:00:00Z", homeTeam: "Costa Rica", awayTeam: "Chile", homeFlagCode: "cr", awayFlagCode: "cl", phase: "group", group: "J", venue: "Gillette Stadium", city: "Boston" },
  { id: "g_j3", date: "2026-06-22T18:00:00Z", homeTeam: "Australia", awayTeam: "Costa Rica", homeFlagCode: "au", awayFlagCode: "cr", phase: "group", group: "J", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "g_j4", date: "2026-06-22T22:00:00Z", homeTeam: "Chile", awayTeam: "Irak", homeFlagCode: "cl", awayFlagCode: "iq", phase: "group", group: "J", venue: "MetLife Stadium", city: "New York" },
  { id: "g_j5", date: "2026-06-26T22:00:00Z", homeTeam: "Irak", awayTeam: "Costa Rica", homeFlagCode: "iq", awayFlagCode: "cr", phase: "group", group: "J", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "g_j6", date: "2026-06-26T22:00:00Z", homeTeam: "Chile", awayTeam: "Australia", homeFlagCode: "cl", awayFlagCode: "au", phase: "group", group: "J", venue: "Mercedes-Benz Stadium", city: "Atlanta" },

  // Grupo K
  { id: "g_k1", date: "2026-06-18T22:00:00Z", homeTeam: "Dinamarca", awayTeam: "Congo", homeFlagCode: "dk", awayFlagCode: "cd", phase: "group", group: "K", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "g_k2", date: "2026-06-19T18:00:00Z", homeTeam: "México", awayTeam: "Perú", homeFlagCode: "mx", awayFlagCode: "pe", phase: "group", group: "K", venue: "AT&T Stadium", city: "Dallas" },
  { id: "g_k3", date: "2026-06-23T02:00:00Z", homeTeam: "Dinamarca", awayTeam: "México", homeFlagCode: "dk", awayFlagCode: "mx", phase: "group", group: "K", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "g_k4", date: "2026-06-23T18:00:00Z", homeTeam: "Perú", awayTeam: "Congo", homeFlagCode: "pe", awayFlagCode: "cd", phase: "group", group: "K", venue: "Lumen Field", city: "Seattle" },
  { id: "g_k5", date: "2026-06-27T22:00:00Z", homeTeam: "Congo", awayTeam: "México", homeFlagCode: "cd", awayFlagCode: "mx", phase: "group", group: "K", venue: "BC Place", city: "Vancouver" },
  { id: "g_k6", date: "2026-06-27T22:00:00Z", homeTeam: "Perú", awayTeam: "Dinamarca", homeFlagCode: "pe", awayFlagCode: "dk", phase: "group", group: "K", venue: "Estadio Akron", city: "Guadalajara" },

  // Grupo L
  { id: "g_l1", date: "2026-06-19T22:00:00Z", homeTeam: "Polonia", awayTeam: "Indonesia", homeFlagCode: "pl", awayFlagCode: "id", phase: "group", group: "L", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "g_l2", date: "2026-06-20T02:00:00Z", homeTeam: "Rumania", awayTeam: "Camerún", homeFlagCode: "ro", awayFlagCode: "cm", phase: "group", group: "L", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "g_l3", date: "2026-06-24T02:00:00Z", homeTeam: "Polonia", awayTeam: "Rumania", homeFlagCode: "pl", awayFlagCode: "ro", phase: "group", group: "L", venue: "BMO Field", city: "Toronto" },
  { id: "g_l4", date: "2026-06-24T18:00:00Z", homeTeam: "Camerún", awayTeam: "Indonesia", homeFlagCode: "cm", awayFlagCode: "id", phase: "group", group: "L", venue: "Gillette Stadium", city: "Boston" },
  { id: "g_l5", date: "2026-06-28T22:00:00Z", homeTeam: "Indonesia", awayTeam: "Rumania", homeFlagCode: "id", awayFlagCode: "ro", phase: "group", group: "L", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "g_l6", date: "2026-06-28T22:00:00Z", homeTeam: "Camerún", awayTeam: "Polonia", homeFlagCode: "cm", awayFlagCode: "pl", phase: "group", group: "L", venue: "MetLife Stadium", city: "New York" },

  // ── RONDA DE 32 ──────────────────────────────────────────────────────────
  { id: "r32_1",  date: "2026-07-01T22:00:00Z", homeTeam: "1A", awayTeam: "2B", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "MetLife Stadium", city: "New York" },
  { id: "r32_2",  date: "2026-07-01T18:00:00Z", homeTeam: "1B", awayTeam: "2A", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "AT&T Stadium", city: "Dallas" },
  { id: "r32_3",  date: "2026-07-02T22:00:00Z", homeTeam: "1C", awayTeam: "2D", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "r32_4",  date: "2026-07-02T18:00:00Z", homeTeam: "1D", awayTeam: "2C", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "r32_5",  date: "2026-07-03T22:00:00Z", homeTeam: "1E", awayTeam: "2F", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "r32_6",  date: "2026-07-03T18:00:00Z", homeTeam: "1F", awayTeam: "2E", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "BC Place", city: "Vancouver" },
  { id: "r32_7",  date: "2026-07-04T22:00:00Z", homeTeam: "1G", awayTeam: "2H", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Lumen Field", city: "Seattle" },
  { id: "r32_8",  date: "2026-07-04T18:00:00Z", homeTeam: "1H", awayTeam: "2G", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Gillette Stadium", city: "Boston" },
  { id: "r32_9",  date: "2026-07-05T22:00:00Z", homeTeam: "1I", awayTeam: "2J", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Estadio Akron", city: "Guadalajara" },
  { id: "r32_10", date: "2026-07-05T18:00:00Z", homeTeam: "1J", awayTeam: "2I", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Mercedes-Benz Stadium", city: "Atlanta" },
  { id: "r32_11", date: "2026-07-06T22:00:00Z", homeTeam: "1K", awayTeam: "2L", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "BMO Field", city: "Toronto" },
  { id: "r32_12", date: "2026-07-06T18:00:00Z", homeTeam: "1L", awayTeam: "2K", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Arrowhead Stadium", city: "Kansas City" },
  { id: "r32_13", date: "2026-07-07T22:00:00Z", homeTeam: "3A/B/C/D", awayTeam: "3E/F/G/H", homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Lincoln Financial Field", city: "Philadelphia" },
  { id: "r32_14", date: "2026-07-07T18:00:00Z", homeTeam: "3I/J/K/L", awayTeam: "3X",          homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "r32_15", date: "2026-07-08T22:00:00Z", homeTeam: "3X", awayTeam: "3X",                 homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "Levi's Stadium", city: "San Francisco" },
  { id: "r32_16", date: "2026-07-08T18:00:00Z", homeTeam: "3X", awayTeam: "3X",                 homeFlagCode: "", awayFlagCode: "", phase: "round_of_32", venue: "MetLife Stadium", city: "New York" },

  // ── OCTAVOS DE FINAL ─────────────────────────────────────────────────────
  { id: "r16_1", date: "2026-07-11T22:00:00Z", homeTeam: "W r32_1",  awayTeam: "W r32_2",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "MetLife Stadium", city: "New York" },
  { id: "r16_2", date: "2026-07-11T18:00:00Z", homeTeam: "W r32_3",  awayTeam: "W r32_4",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "r16_3", date: "2026-07-12T22:00:00Z", homeTeam: "W r32_5",  awayTeam: "W r32_6",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Hard Rock Stadium", city: "Miami" },
  { id: "r16_4", date: "2026-07-12T18:00:00Z", homeTeam: "W r32_7",  awayTeam: "W r32_8",  homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "AT&T Stadium", city: "Dallas" },
  { id: "r16_5", date: "2026-07-13T22:00:00Z", homeTeam: "W r32_9",  awayTeam: "W r32_10", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "r16_6", date: "2026-07-13T18:00:00Z", homeTeam: "W r32_11", awayTeam: "W r32_12", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Lumen Field", city: "Seattle" },
  { id: "r16_7", date: "2026-07-14T22:00:00Z", homeTeam: "W r32_13", awayTeam: "W r32_14", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "BC Place", city: "Vancouver" },
  { id: "r16_8", date: "2026-07-14T18:00:00Z", homeTeam: "W r32_15", awayTeam: "W r32_16", homeFlagCode: "", awayFlagCode: "", phase: "round_of_16", venue: "Gillette Stadium", city: "Boston" },

  // ── CUARTOS DE FINAL ──────────────────────────────────────────────────────
  { id: "qf_1", date: "2026-07-17T22:00:00Z", homeTeam: "W r16_1", awayTeam: "W r16_2", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "MetLife Stadium", city: "New York" },
  { id: "qf_2", date: "2026-07-17T18:00:00Z", homeTeam: "W r16_3", awayTeam: "W r16_4", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "SoFi Stadium", city: "Los Angeles" },
  { id: "qf_3", date: "2026-07-18T22:00:00Z", homeTeam: "W r16_5", awayTeam: "W r16_6", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "Estadio Azteca", city: "Ciudad de México" },
  { id: "qf_4", date: "2026-07-18T18:00:00Z", homeTeam: "W r16_7", awayTeam: "W r16_8", homeFlagCode: "", awayFlagCode: "", phase: "quarterfinal", venue: "AT&T Stadium", city: "Dallas" },

  // ── SEMIFINALES ───────────────────────────────────────────────────────────
  { id: "sf_1", date: "2026-07-21T22:00:00Z", homeTeam: "W qf_1", awayTeam: "W qf_2", homeFlagCode: "", awayFlagCode: "", phase: "semifinal", venue: "MetLife Stadium", city: "New York" },
  { id: "sf_2", date: "2026-07-22T22:00:00Z", homeTeam: "W qf_3", awayTeam: "W qf_4", homeFlagCode: "", awayFlagCode: "", phase: "semifinal", venue: "AT&T Stadium", city: "Dallas" },

  // ── TERCER PUESTO ─────────────────────────────────────────────────────────
  { id: "3rd",   date: "2026-07-25T22:00:00Z", homeTeam: "L sf_1",  awayTeam: "L sf_2",  homeFlagCode: "", awayFlagCode: "", phase: "third_place", venue: "Hard Rock Stadium", city: "Miami" },

  // ── FINAL ─────────────────────────────────────────────────────────────────
  { id: "final", date: "2026-07-19T20:00:00Z", homeTeam: "W sf_1",  awayTeam: "W sf_2",  homeFlagCode: "", awayFlagCode: "", phase: "final", venue: "MetLife Stadium", city: "New York" },
];
