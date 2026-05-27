import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  getCountFromServer,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { Match, Prediction, UserProfile, BonusPrediction } from "@/types";
import { FIXTURE } from "./fixture";
import { calculateScore } from "./scoring";

// ── Matches ───────────────────────────────────────────────────────────────

export async function seedFixture() {
  const batch = writeBatch(db);
  for (const m of FIXTURE) {
    const ref = doc(db, "matches", m.id);
    batch.set(ref, { ...m, homeScore: null, awayScore: null }, { merge: true });
  }
  await batch.commit();
}

export async function getMatches(): Promise<Match[]> {
  const snap = await getDocs(query(collection(db, "matches"), orderBy("date", "asc")));
  return snap.docs.map((d) => d.data() as Match);
}

export function subscribeMatches(cb: (matches: Match[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "matches"), orderBy("date", "asc")),
    (snap) => cb(snap.docs.map((d) => d.data() as Match))
  );
}

export async function updateMatchResult(matchId: string, homeScore: number, awayScore: number) {
  await updateDoc(doc(db, "matches", matchId), { homeScore, awayScore });
  await recalculatePredictionsForMatch(matchId);
}

// ── Predictions ───────────────────────────────────────────────────────────

export async function savePrediction(userId: string, matchId: string, homeScore: number, awayScore: number) {
  const id = `${userId}_${matchId}`;
  const ref = doc(db, "predictions", id);
  const existing = await getDoc(ref);

  const matchSnap = await getDoc(doc(db, "matches", matchId));
  const matchDate: string | undefined = matchSnap.exists()
    ? (matchSnap.data() as Match).date
    : FIXTURE.find((m) => m.id === matchId)?.date;

  if (!matchDate) throw new Error("Partido no encontrado");

  // No permitir predicciones si el partido ya empezó
  if (new Date(matchDate) <= new Date()) {
    throw new Error("El partido ya comenzó, no podés modificar tu predicción");
  }

  const now = new Date().toISOString();
  if (existing.exists()) {
    await updateDoc(ref, { homeScore, awayScore, updatedAt: now });
  } else {
    await setDoc(ref, {
      id,
      userId,
      matchId,
      homeScore,
      awayScore,
      points: null,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  const snap = await getDocs(query(collection(db, "predictions"), where("userId", "==", userId)));
  return snap.docs.map((d) => d.data() as Prediction);
}

export async function deletePrediction(userId: string, matchId: string) {
  await deleteDoc(doc(db, "predictions", `${userId}_${matchId}`));
}

export function subscribeUserPredictions(userId: string, cb: (preds: Prediction[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "predictions"), where("userId", "==", userId)),
    (snap) => cb(snap.docs.map((d) => d.data() as Prediction))
  );
}

// ── Scoring ───────────────────────────────────────────────────────────────

async function recalculatePredictionsForMatch(matchId: string) {
  const matchSnap = await getDoc(doc(db, "matches", matchId));
  const match = matchSnap.data() as Match;

  const predsSnap = await getDocs(
    query(collection(db, "predictions"), where("matchId", "==", matchId))
  );

  const batch = writeBatch(db);
  const userPointsDelta: Record<string, { points: number; partial: number; exact: number }> = {};

  for (const predDoc of predsSnap.docs) {
    const pred = predDoc.data() as Prediction;
    const { points, reason } = calculateScore(match, pred);
    const wasExact = reason === "exact";
    const wasPartial = reason !== "exact" && reason !== "miss";

    batch.update(predDoc.ref, { points });

    if (!userPointsDelta[pred.userId]) {
      userPointsDelta[pred.userId] = { points: 0, partial: 0, exact: 0 };
    }
    const oldPoints = pred.points ?? 0;
    userPointsDelta[pred.userId].points += points - oldPoints;
    if (wasExact) userPointsDelta[pred.userId].exact += 1;
    if (wasPartial) userPointsDelta[pred.userId].partial += 1;
  }

  // Actualizar totales en perfiles de usuario
  for (const [uid, delta] of Object.entries(userPointsDelta)) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const u = userSnap.data() as UserProfile;
      batch.update(userRef, {
        totalPoints: (u.totalPoints || 0) + delta.points,
        partialCount: (u.partialCount || 0) + delta.partial,
        exactCount: (u.exactCount || 0) + delta.exact,
      });
    }
  }

  await batch.commit();
}

// ── Bonus Predictions ─────────────────────────────────────────────────────

export async function saveBonusPrediction(
  userId: string,
  tournamentId: string,
  data: Partial<Pick<BonusPrediction, "champion" | "topScorerTeam" | "topScorerPlayer" | "bestPlayerTeam" | "bestPlayerPlayer">>
) {
  const id = `${userId}_${tournamentId}`;
  const ref = doc(db, "bonusPredictions", id);
  const now = new Date().toISOString();
  const existing = await getDoc(ref);
  if (existing.exists()) {
    await updateDoc(ref, { ...data, updatedAt: now });
  } else {
    await setDoc(ref, {
      id, userId, tournamentId,
      champion: "", topScorerTeam: "", topScorerPlayer: "",
      bestPlayerTeam: "", bestPlayerPlayer: "",
      ...data,
      updatedAt: now,
    });
  }
}

export function subscribeBonusPrediction(
  userId: string,
  tournamentId: string,
  cb: (pred: BonusPrediction | null) => void
): Unsubscribe {
  const id = `${userId}_${tournamentId}`;
  return onSnapshot(doc(db, "bonusPredictions", id), (snap) => {
    cb(snap.exists() ? (snap.data() as BonusPrediction) : null);
  });
}

// ── Leaderboard ───────────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<UserProfile[]> {
  const snap = await getDocs(
    query(collection(db, "users"), orderBy("totalPoints", "desc"))
  );
  return snap.docs.map((d) => d.data() as UserProfile);
}

export function subscribeLeaderboard(cb: (users: UserProfile[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "users"), orderBy("totalPoints", "desc")),
    (snap) => cb(snap.docs.map((d) => d.data() as UserProfile))
  );
}

// ── Admin stats ───────────────────────────────────────────────────────────

export interface AdminStats {
  totalTournaments: number;
  totalUsers: number;
  totalPredictions: number;
  matchesWithResults: number;
  tournamentsByDay: { date: string; count: number }[];
  usersByDay: { date: string; count: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const [tournamentsCount, usersCount, predictionsCount, resultsCount, tournamentsSnap, usersSnap] =
    await Promise.all([
      getCountFromServer(collection(db, "tournaments")),
      getCountFromServer(collection(db, "users")),
      getCountFromServer(collection(db, "predictions")),
      getCountFromServer(query(collection(db, "matches"), where("homeScore", "!=", null))),
      getDocs(collection(db, "tournaments")),
      getDocs(collection(db, "users")),
    ]);

  function groupByDay(
    docs: { data(): Record<string, unknown> }[],
    field: string,
    days: number
  ): { date: string; count: number }[] {
    const counts: Record<string, number> = {};
    docs.forEach((d) => {
      const val = d.data()[field];
      if (typeof val === "string" && val.length >= 10) {
        const date = val.slice(0, 10);
        counts[date] = (counts[date] ?? 0) + 1;
      }
    });
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().slice(0, 10);
      return { date: dateStr, count: counts[dateStr] ?? 0 };
    });
  }

  return {
    totalTournaments: tournamentsCount.data().count,
    totalUsers: usersCount.data().count,
    totalPredictions: predictionsCount.data().count,
    matchesWithResults: resultsCount.data().count,
    tournamentsByDay: groupByDay(tournamentsSnap.docs, "createdAt", 14),
    usersByDay: groupByDay(usersSnap.docs, "createdAt", 14),
  };
}
