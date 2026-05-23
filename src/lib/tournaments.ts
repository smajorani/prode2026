import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { Tournament } from "@/types";

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createTournament(userId: string, name: string): Promise<Tournament> {
  let id = generateId();
  while ((await getDoc(doc(db, "tournaments", id))).exists()) {
    id = generateId();
  }

  const tournament: Tournament = {
    id,
    name: name.trim(),
    description: "",
    createdBy: userId,
    admins: [userId],
    members: [userId],
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "tournaments", id), tournament);
  return tournament;
}

export async function joinTournament(userId: string, rawId: string): Promise<Tournament> {
  const id = rawId.trim().toUpperCase();
  const ref = doc(db, "tournaments", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("No existe un torneo con ese código");

  const tournament = snap.data() as Tournament;
  if (tournament.members.includes(userId)) return tournament;

  await updateDoc(ref, { members: arrayUnion(userId) });
  return { ...tournament, members: [...tournament.members, userId] };
}

export async function getUserTournaments(userId: string): Promise<Tournament[]> {
  const snap = await getDocs(
    query(collection(db, "tournaments"), where("members", "array-contains", userId))
  );
  return snap.docs.map((d) => d.data() as Tournament);
}

export async function getTournament(id: string): Promise<Tournament | null> {
  const snap = await getDoc(doc(db, "tournaments", id));
  return snap.exists() ? (snap.data() as Tournament) : null;
}

export function subscribeTournament(id: string, onChange: (t: Tournament) => void): () => void {
  return onSnapshot(doc(db, "tournaments", id), (snap) => {
    if (snap.exists()) onChange(snap.data() as Tournament);
  });
}

// ── Admin functions ───────────────────────────────────────────────────────

export async function updateTournamentInfo(id: string, data: { name?: string; description?: string }) {
  await updateDoc(doc(db, "tournaments", id), data);
}

export async function removeMember(tournamentId: string, userId: string) {
  await updateDoc(doc(db, "tournaments", tournamentId), {
    members: arrayRemove(userId),
    admins: arrayRemove(userId),
  });
}

export async function promoteToAdmin(tournamentId: string, userId: string) {
  await updateDoc(doc(db, "tournaments", tournamentId), {
    admins: arrayUnion(userId),
  });
}

export async function demoteAdmin(tournamentId: string, userId: string) {
  await updateDoc(doc(db, "tournaments", tournamentId), {
    admins: arrayRemove(userId),
  });
}

// Helper: un usuario es admin si está en admins[] o es el creador (fallback para torneos viejos)
export function isTournamentAdmin(tournament: Tournament, userId: string): boolean {
  return tournament.createdBy === userId || (tournament.admins ?? []).includes(userId);
}
