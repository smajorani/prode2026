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
        <p className="text-gray-500">
          <a href="/login" className="text-celeste-600 font-semibold underline">Iniciá sesión</a> para gestionar tus torneos.
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

  const inputCls =
    "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 transition";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink-900">Mis Torneos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setModal("join"); setError(""); setCode(""); }}
            className="text-sm border border-gray-200 bg-white text-ink-900 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => { setModal("create"); setError(""); setName(""); setCreated(null); }}
            className="text-sm bg-celeste-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-celeste-600 transition-colors shadow-sm shadow-celeste-500/30"
          >
            Crear torneo
          </button>
        </div>
      </div>

      {/* Lista de torneos */}
      {tournaments.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-[var(--shadow-card)]">
          <p className="text-lg font-semibold text-ink-900 mb-1">No estás en ningún torneo todavía</p>
          <p className="text-sm text-gray-500">Creá uno o pedile el código a alguien.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tournaments.map((t) => {
          const isCurrent = currentTournament?.id === t.id;
          const isOwner = t.createdBy === user.uid;
          return (
            <div
              key={t.id}
              className={`bg-white border rounded-2xl px-5 py-4 flex items-center gap-4 transition-colors shadow-[var(--shadow-card)] ${
                isCurrent ? "border-celeste-300 ring-1 ring-celeste-200" : "border-gray-200"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink-900 flex items-center gap-2 flex-wrap">
                  {t.name}
                  {isOwner && <span className="text-xs text-gray-400 font-normal">Creador</span>}
                  {isCurrent && <span className="text-xs text-celeste-600 font-semibold">Activo</span>}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {t.members.length} {t.members.length === 1 ? "participante" : "participantes"} · Código:{" "}
                  <span className="font-mono font-bold text-ink-900 tracking-widest">{t.id}</span>
                </div>
              </div>
              <button
                onClick={() => { setCurrentTournament(t); router.push("/fixture"); }}
                className={`text-sm px-4 py-2 rounded-xl font-medium transition-colors flex-shrink-0 ${
                  isCurrent
                    ? "bg-celeste-500 text-white hover:bg-celeste-600 shadow-sm shadow-celeste-500/30"
                    : "border border-gray-200 text-ink-900 hover:bg-gray-50"
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
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-[var(--shadow-pop)]">
            {created ? (
              <>
                <h2 className="text-xl font-display font-extrabold text-ink-900 mb-1">¡Torneo creado!</h2>
                <p className="text-gray-500 text-sm mb-5">Compartí este código con tus amigos para que se unan:</p>
                <div className="bg-celeste-50 border border-celeste-200 rounded-xl p-6 text-center mb-5">
                  <div className="text-4xl font-mono font-bold tracking-[0.3em] text-celeste-600">{created.id}</div>
                  <div className="text-xs text-gray-500 mt-2">{created.name}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(
                      `Te invito a sumarte a mi torneo de prode del Mundial 2026: https://www.prode2026.ar/torneos/${created.id}`
                    )}
                    className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Copiar invitación
                  </button>
                  <button
                    onClick={() => { setModal(null); setCreated(null); router.push("/fixture"); }}
                    className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 transition-colors"
                  >
                    Ir al fixture
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-display font-extrabold text-ink-900 mb-4">Crear torneo</h2>
                <input
                  type="text"
                  placeholder="Nombre del torneo (ej: Torneo familia)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className={`w-full mb-3 ${inputCls}`}
                  autoFocus
                  maxLength={40}
                />
                {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-[var(--shadow-pop)]">
            <h2 className="text-xl font-display font-extrabold text-ink-900 mb-4">Entrar a un torneo</h2>
            <p className="text-gray-500 text-sm mb-4">Pedile el código de 6 letras al creador del torneo.</p>
            <input
              type="text"
              placeholder="CÓDIGO (ej: XKQW3A)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className={`w-full mb-3 font-mono tracking-widest uppercase text-center text-lg ${inputCls}`}
              autoFocus
              maxLength={6}
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-200 text-ink-900 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="flex-1 bg-celeste-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50"
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
