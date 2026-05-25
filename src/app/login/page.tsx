"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Ball from "@/components/Ball";

export default function LoginPage() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setError("Ingresá tu nombre");
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName.trim());
      }
      router.push("/fixture");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        setError("Email o contraseña incorrectos");
      } else if (msg.includes("email-already-in-use")) {
        setError("Ya existe una cuenta con ese email");
      } else if (msg.includes("weak-password")) {
        setError("La contraseña debe tener al menos 6 caracteres");
      } else {
        setError("Ocurrió un error. Intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/fixture");
    } catch {
      setError("No se pudo iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20 transition";

  return (
    <div className="min-h-[72vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-8 shadow-[var(--shadow-md)]">
        <div className="flex justify-center mb-5">
          <Ball size={40} />
        </div>
        <h1 className="text-2xl font-display font-extrabold text-ink-900 text-center mb-1">
          {mode === "login" ? "Iniciá sesión" : "Creá tu cuenta"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-7">
          {mode === "login" ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-celeste-600 font-semibold hover:text-celeste-700"
          >
            {mode === "login" ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Tu nombre (para el ranking)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputCls}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            required
            minLength={6}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-celeste-500 text-white font-bold py-3 rounded-xl hover:bg-celeste-600 transition-colors disabled:opacity-50 shadow-sm shadow-celeste-500/30 mt-1"
          >
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">o</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-ink-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
