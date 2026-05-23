import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Tournament } from "@/types";

// Genera un código de 6 caracteres legible (sin 0, O, 1, I para evitar confusión)
function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function createTournament(userId: string, name: string): Promise<Tournament> {
  let id = generateId();
  // Asegurarse de que el ID no exista (colisión muy improbable pero vale)
  while ((await getDoc(doc(db, "tournaments", id))).exists()) {
    id = generateId();
  }

  const tournament: Tournament = {
    id,
    name: name.trim(),
    createdBy: userId,
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

  if (!snap.exists()) {
    throw new Error("No existe un torneo con ese código");
  }

  const tournament = snap.data() as Tournament;

  if (tournament.members.includes(userId)) {
    return tournament; // Ya es miembro, no hacer nada
  }

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

