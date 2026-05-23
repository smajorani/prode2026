"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTournament } from "@/context/TournamentContext";
import { createTournament, joinTournament } from "@/lib/tournaments";
import { Tournament } from "@/types";

export default function TorneosPage() {
  const { user } = useAuth();
  const { tournaments, currentTournament, setCurrentTournament, refreshTournaments } = useTournament();
  const router = useRouter();

  const [modal, setModal] = useState<"create" | "join" | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Tournament | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">
          <a href="/login" className="text-yellow-400 underline">Iniciá sesión</a> para gestionar tus torneos.
        </p>
      </div>
    );
  }

  async function handleCreate() {
    if (!name.trim()) { setError("Ingresá un nombre para el torneo"); return; }
    setLoading(true); setError("");
    try {
      const t = await createTournament(user!.uid, name);
      await refreshTournaments();
      setCurrentTournament(t);
      setCreated(t);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el torneo");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!code.trim()) { setError("Ingresá el código del torneo"); return; }
    setLoading(true); setError("");
    try {
      const t = await joinTournament(user!.uid, code);
      await refreshTournaments();
      setCurrentTournament(t);
      setModal(null);
      setCode("");
      router.push("/fixture");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al unirse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis Torneos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setModal("join"); setError(""); setCode(""); }}
            className="text-sm border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Entrar a un torneo
          </button>
          <button
            onClick={() => { setModal("create"); setError(""); setName(""); setCreated(null); }}
            className="text-sm bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Crear torneo
          </button>
        </div>
      </div>

      {/* Lista de torneos */}
      {tournaments.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
          <p className="text-lg mb-2">No estás en ningún torneo todavía</p>
          <p className="text-sm">Creá uno o pedile el código a alguien.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tournaments.map((t) => {
          const isCurrent = currentTournament?.id === t.id;
          const isOwner = t.createdBy === user.uid;
          return (
            <div
              key={t.id}
              className={`bg-gray-900 border rounded-xl px-5 py-4 flex items-center gap-4 transition-colors ${
                isCurrent ? "border-yellow-400/50" : "border-gray-800"
              }`}
            >
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  {t.name}
                  {isOwner && <span className="text-xs text-gray-500 font-normal">Creador</span>}
                  {isCurrent && <span className="text-xs text-yellow-400 font-normal">Activo</span>}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">
                  {t.members.length} {t.members.length === 1 ? "participante" : "participantes"} · Código:{" "}
                  <span className="font-mono font-bold text-white tracking-widest">{t.id}</span>
                </div>
              </div>
              <button
                onClick={() => { setCurrentTournament(t); router.push("/fixture"); }}
                className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "border border-gray-700 hover:bg-gray-800"
                }`}
              >
                {isCurrent ? "Ir al fixture" : "Seleccionar"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal crear */}
      {modal === "create" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            {created ? (
              <>
                <h2 className="text-xl font-bold mb-1">¡Torneo creado!</h2>
                <p className="text-gray-400 text-sm mb-5">Compartí este código con tus amigos para que se unan:</p>
                <div className="bg-gray-950 border border-yellow-400/30 rounded-xl p-6 text-center mb-5">
                  <div className="text-4xl font-mono font-bold tracking-[0.3em] text-yellow-400">{created.id}</div>
                  <div className="text-xs text-gray-500 mt-2">{created.name}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(
                      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${created.id}`
                    )}
                    className="flex-1 border border-gray-700 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Copiar invitación
                  </button>
                  <button
                    onClick={() => { setModal(null); setCreated(null); router.push("/fixture"); }}
                    className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
                  >
                    Ir al fixture
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Crear torneo</h2>
                <input
                  type="text"
                  placeholder="Nombre del torneo (ej: Torneo familia)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-yellow-400"
                  autoFocus
                  maxLength={40}
                />
                {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setModal(null)} className="flex-1 border border-gray-700 py-2 rounded-lg text-sm hover:bg-gray-800">
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-300 disabled:opacity-50"
                  >
                    {loading ? "Creando..." : "Crear"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal unirse */}
      {modal === "join" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Entrar a un torneo</h2>
            <p className="text-gray-400 text-sm mb-4">Pedile el código de 6 letras al creador del torneo.</p>
            <input
              type="text"
              placeholder="CÓDIGO (ej: XKQW3A)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm mb-3 font-mono tracking-widest uppercase text-center text-lg focus:outline-none focus:border-yellow-400"
              autoFocus
              maxLength={6}
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-700 py-2 rounded-lg text-sm hover:bg-gray-800">
                Cancelar
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-yellow-300 disabled:opacity-50"
              >
                {loading ? "Uniéndose..." : "Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
