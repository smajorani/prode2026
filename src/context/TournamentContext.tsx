"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Tournament } from "@/types";
import { getUserTournaments } from "@/lib/tournaments";
import { useAuth } from "./AuthContext";

interface TournamentContextType {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  setCurrentTournament: (t: Tournament | null) => void;
  refreshTournaments: () => Promise<void>;
  loading: boolean;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

const STORAGE_KEY = "prode_current_tournament";

export function TournamentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [currentTournament, setCurrentTournamentState] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshTournaments() {
    if (!user) { setTournaments([]); return; }
    setLoading(true);
    const list = await getUserTournaments(user.uid);
    setTournaments(list);

    // Restaurar torneo seleccionado desde localStorage
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      const found = list.find((t) => t.id === savedId);
      setCurrentTournamentState(found ?? (list[0] ?? null));
    } else if (list.length > 0) {
      setCurrentTournamentState(list[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    refreshTournaments();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  function setCurrentTournament(t: Tournament | null) {
    setCurrentTournamentState(t);
    if (t) localStorage.setItem(STORAGE_KEY, t.id);
    else localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <TournamentContext.Provider value={{ tournaments, currentTournament, setCurrentTournament, refreshTournaments, loading }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}
