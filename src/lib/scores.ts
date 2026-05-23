const SCORE_WEIGHTS = [
  { score: "1-1", weight: 11.317 }, { score: "1-0", weight: 10.229 },
  { score: "2-1", weight: 8.342 },  { score: "0-0", weight: 7.349 },
  { score: "2-0", weight: 7.249 },  { score: "0-1", weight: 7.15 },
  { score: "1-2", weight: 5.561 },  { score: "2-2", weight: 4.568 },
  { score: "3-1", weight: 4.37 },   { score: "0-2", weight: 4.27 },
  { score: "3-0", weight: 3.476 },  { score: "1-3", weight: 3.178 },
  { score: "3-2", weight: 3.178 },  { score: "2-3", weight: 2.483 },
  { score: "4-1", weight: 2.185 },  { score: "4-0", weight: 1.788 },
  { score: "0-3", weight: 1.788 },  { score: "4-2", weight: 1.39 },
  { score: "3-3", weight: 1.291 },  { score: "1-4", weight: 1.241 },
  { score: "2-4", weight: 1.092 },  { score: "5-1", weight: 0.844 },
  { score: "5-0", weight: 0.695 },  { score: "0-4", weight: 0.695 },
  { score: "4-3", weight: 0.546 },  { score: "1-5", weight: 0.516 },
  { score: "5-2", weight: 0.497 },  { score: "3-4", weight: 0.447 },
  { score: "2-5", weight: 0.397 },  { score: "0-5", weight: 0.298 },
  { score: "6-0", weight: 0.228 },  { score: "5-3", weight: 0.209 },
  { score: "3-5", weight: 0.169 },  { score: "6-1", weight: 0.159 },
  { score: "4-4", weight: 0.139 },  { score: "1-6", weight: 0.079 },
  { score: "0-6", weight: 0.06 },   { score: "6-2", weight: 0.05 },
  { score: "2-6", weight: 0.05 },   { score: "7-0", weight: 0.05 },
  { score: "5-4", weight: 0.04 },   { score: "4-5", weight: 0.04 },
  { score: "6-3", weight: 0.03 },   { score: "3-6", weight: 0.03 },
  { score: "0-7", weight: 0.03 },   { score: "7-1", weight: 0.03 },
  { score: "6-5", weight: 0.02 },   { score: "5-6", weight: 0.02 },
  { score: "1-7", weight: 0.02 },   { score: "7-2", weight: 0.02 },
  { score: "6-4", weight: 0.015 },  { score: "4-6", weight: 0.015 },
  { score: "2-7", weight: 0.015 },  { score: "5-5", weight: 0.01 },
  { score: "7-3", weight: 0.01 },   { score: "3-7", weight: 0.008 },
  { score: "6-6", weight: 0.005 },  { score: "7-4", weight: 0.005 },
  { score: "4-7", weight: 0.005 },  { score: "7-5", weight: 0.003 },
  { score: "5-7", weight: 0.003 },  { score: "7-6", weight: 0.001 },
  { score: "6-7", weight: 0.001 },  { score: "7-7", weight: 0.001 },
];

const TOTAL_WEIGHT = SCORE_WEIGHTS.reduce((s, x) => s + x.weight, 0);

export function weightedRandomScore(): { home: number; away: number } {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const { score, weight } of SCORE_WEIGHTS) {
    r -= weight;
    if (r <= 0) {
      const [h, a] = score.split("-").map(Number);
      return { home: h, away: a };
    }
  }
  return { home: 1, away: 1 };
}
