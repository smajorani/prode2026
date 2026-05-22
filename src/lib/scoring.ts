import { Match, Prediction, Phase, SCORING, ScoringResult } from "@/types";

function getWinner(home: number, away: number): "home" | "away" | "draw" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function calculateScore(match: Match, prediction: Prediction): ScoringResult {
  const { homeScore: realHome, awayScore: realAway, phase } = match;
  const { homeScore: predHome, awayScore: predAway } = prediction;

  if (realHome === null || realAway === null) {
    return { points: 0, reason: "miss" };
  }

  const table = SCORING[phase as Phase];

  // Resultado exacto
  if (predHome === realHome && predAway === realAway) {
    return { points: table.exact, reason: "exact" };
  }

  const realWinner = getWinner(realHome, realAway);
  const predWinner = getWinner(predHome, predAway);
  const realDiff = realHome - realAway;
  const predDiff = predHome - predAway;

  // Ganador correcto + diferencia de goles exacta
  if (predWinner === realWinner && predDiff === realDiff) {
    return { points: table.winner_and_diff, reason: "winner_and_diff" };
  }

  // Solo ganador (o empate)
  if (predWinner === realWinner) {
    return { points: table.winner_only, reason: "winner_only" };
  }

  // Goles de un equipo exacto
  if (predHome === realHome || predAway === realAway) {
    return { points: table.one_team_goals, reason: "one_team_goals" };
  }

  return { points: table.miss, reason: "miss" };
}
