export type Phase = "group" | "round_of_32" | "round_of_16" | "quarterfinal" | "semifinal" | "third_place" | "final";

export interface Match {
  id: string;
  date: string; // ISO 8601, ej: "2026-06-11T21:00:00-05:00"
  homeTeam: string;
  awayTeam: string;
  homeFlagCode: string; // código ISO 3166-1 alpha-2 para banderas
  awayFlagCode: string;
  phase: Phase;
  group?: string; // "A", "B", ... "L" — solo en fase de grupos
  venue: string;
  city: string;
  homeScore: number | null; // null = no jugado todavía
  awayScore: number | null;
}

export interface Prediction {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null; // null = partido no jugado aún
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  totalPoints: number;
  predictionsCount: number;
  exactCount: number;
  createdAt: string;
}

export interface ScoringResult {
  points: number;
  reason: "exact" | "winner_and_diff" | "winner_only" | "one_team_goals" | "miss";
}

export const SCORING: Record<Phase, Record<ScoringResult["reason"], number>> = {
  group: {
    exact: 5,
    winner_and_diff: 3,
    winner_only: 2,
    one_team_goals: 1,
    miss: 0,
  },
  round_of_32: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
  round_of_16: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
  quarterfinal: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
  semifinal: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
  third_place: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
  final: {
    exact: 8,
    winner_and_diff: 5,
    winner_only: 3,
    one_team_goals: 1,
    miss: 0,
  },
};
