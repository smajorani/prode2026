"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, deleteUser, reauthenticateWithPopup, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDocs, collection, query, where, writeBatch, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import UserAvatar from "@/components/UserAvatar";

// ── Helpers ───────────────────────────────────────────────────────────────

function resizeToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const min = Math.min(img.width, img.height, 600);
      const canvas = document.createElement("canvas");
      canvas.width = min; canvas.height = min;
      const ctx = canvas.getContext("2d")!;
      const srcSize = Math.min(img.width, img.height);
      const sx = (img.width - srcSize) / 2;
      const sy = (img.height - srcSize) / 2;
      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, min, min);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── Slider de confirmación ────────────────────────────────────────────────

function DeleteSlider({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const THUMB = 44;

  function calcProgress(clientX: number) {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const travel = rect.width - THUMB;
    return Math.max(0, Math.min((clientX - rect.left - THUMB / 2) / travel, 1));
  }

  function onMove(clientX: number) {
    if (!dragging.current) return;
    const p = calcProgress(clientX);
    setProgress(p);
    if (p >= 0.95) { dragging.current = false; setProgress(1); onComplete(); }
  }

  function onEnd() {
    if (dragging.current) { dragging.current = false; setProgress(0); }
  }

  const pct = progress * 100;

  return (
    <div
      ref={containerRef}
      className="relative h-12 bg-red-50 border border-red-200 rounded-full select-none"
      style={{ touchAction: "none" }}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onEnd}
    >
      {/* Label */}
      <span className="absolute inset-0 flex items-center justify-center text-xs text-red-400 font-medium pointer-events-none pl-10">
        Deslizá para eliminar →
      </span>
      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 bg-red-500/20 rounded-full"
        style={{ width: `calc(${pct}% - ${progress * THUMB}px + ${THUMB}px)` }}
      />
      {/* Thumb */}
      <div
        className="absolute top-1 bottom-1 aspect-square bg-red-500 rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing"
        style={{ left: `calc(${pct}% - ${progress * THUMB}px)` }}
        onMouseDown={(e) => { e.preventDefault(); dragging.current = true; }}
        onTouchStart={() => { dragging.current = true; }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isSupporter, setIsSupporter] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportAmount, setSupportAmount] = useState(1000);
  const fileRef = useRef<HTMLInputElement>(null);

  // Delete account state
  const [deleteStep, setDeleteStep] = useState<null | "warn" | "slider" | "reauth">(null);
  const [deleting, setDeleting] = useState(false);
  const [reauthPassword, setReauthPassword] = useState("");
  const [reauthError, setReauthError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setDisplayName(user.displayName || "");
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Suscripción en tiempo real al estado supporter
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setIsSupporter(snap.data()?.supporter === true);
    });
    return unsub;
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Detectar retorno exitoso desde GalioPay
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("supporter=ok")) {
      showToast("¡Pago recibido! Activando modo sin anuncios...");
      window.history.replaceState({}, "", "/perfil");
    }
  }, []);

  async function handleSupport() {
    if (!user) return;
    setSupportLoading(true);
    try {
      const res = await fetch("/api/galio/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, amount: supportAmount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Error al generar el link de pago");
      }
    } catch {
      alert("Error al generar el link de pago");
    } finally {
      setSupportLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleSaveName() {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: displayName.trim() });
      await updateDoc(doc(db, "users", user.uid), { displayName: displayName.trim() });
      showToast("Nombre actualizado");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const dataURL = await resizeToDataURL(file);
      await updateProfile(auth.currentUser!, { photoURL: dataURL });
      await updateDoc(doc(db, "users", user.uid), { photoURL: dataURL });
      setLocalPhoto(dataURL);
      showToast("Foto actualizada");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al procesar la foto");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function doDelete() {
    if (!user || !auth.currentUser) return;
    const predsSnap = await getDocs(query(collection(db, "predictions"), where("userId", "==", user.uid)));
    const batch = writeBatch(db);
    predsSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, "users", user.uid));
    await batch.commit();
    await deleteUser(auth.currentUser);
    router.push("/");
  }

  async function handleDeleteAccount() {
    if (!user || !auth.currentUser) return;
    setDeleting(true);
    try {
      await doDelete();
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/requires-recent-login") {
        setDeleting(false);
        setReauthPassword("");
        setReauthError("");
        setDeleteStep("reauth");
      } else {
        alert("Error al eliminar la cuenta: " + (e instanceof Error ? e.message : ""));
        setDeleting(false);
        setDeleteStep(null);
      }
    }
  }

  async function handleReauth() {
    if (!auth.currentUser || !user) return;
    setDeleting(true);
    setReauthError("");
    try {
      const providerId = auth.currentUser.providerData[0]?.providerId;
      if (providerId === "google.com") {
        await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider());
      } else {
        const credential = EmailAuthProvider.credential(user.email!, reauthPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      await doDelete();
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setReauthError("Contraseña incorrecta");
      } else {
        setReauthError("No se pudo verificar tu identidad");
      }
      setDeleting(false);
    }
  }

  if (loading || !user) return null;

  const currentPhoto = localPhoto ?? user.photoURL;

  return (
    <div className="max-w-md mx-auto py-8 px-4">

      {/* Toast */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {toast}
      </div>

      <h1 className="text-xl font-display font-extrabold text-ink-900 mb-8">Mi perfil</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative group rounded-full ring-4 ring-celeste-100"
          title="Cambiar foto"
        >
          <UserAvatar uid={user.uid} photoURL={currentPhoto} size={88} />
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? (
              <span className="text-white text-xs font-medium">Procesando...</span>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        </button>
        <p className="text-xs text-gray-400">Clic para cambiar la foto</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Datos */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 mb-8 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500">Nombre de usuario</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-celeste-500 focus:ring-2 focus:ring-celeste-500/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500">Email</label>
          <p className="text-sm text-gray-500 px-4 py-2.5">{user.email}</p>
        </div>
        <button
          onClick={handleSaveName}
          disabled={saving || !displayName.trim()}
          className="self-end bg-celeste-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-celeste-600 disabled:opacity-50 transition-colors shadow-sm shadow-celeste-500/30"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Supporter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-[var(--shadow-card)]">
        {isSupporter ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl">⭐</div>
            <div>
              <p className="font-semibold text-ink-900 text-sm">¡Sos supporter!</p>
              <p className="text-xs text-gray-400 mt-0.5">No ves anuncios en el sitio. ¡Gracias por apoyar!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0 text-xl">☕</div>
              <div>
                <p className="font-semibold text-ink-900 text-sm">Apoyá el sitio — sin anuncios</p>
                <p className="text-xs text-gray-400 mt-0.5">Con cualquier contribución eliminás los anuncios para siempre.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={supportAmount}
                  onChange={(e) => setSupportAmount(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleSupport}
                disabled={supportLoading || supportAmount < 100}
                className="bg-yellow-400 hover:bg-yellow-500 text-ink-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm flex-shrink-0"
              >
                {supportLoading ? "..." : "Apoyar →"}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-1.5">Mínimo $100 ARS · Pago único</p>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setDeleteStep("warn")}
          className="text-xs text-gray-400 hover:text-red-600 transition-colors"
        >
          Eliminar cuenta
        </button>
      </div>

      {/* ── MODAL 1: Advertencia ── */}
      {deleteStep === "warn" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setDeleteStep(null)} />
          <div className="relative bg-white border border-gray-200 rounded-2xl p-7 w-full max-w-sm shadow-[var(--shadow-pop)]">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4 mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-display font-extrabold text-ink-900 text-center mb-2">¿Eliminar tu cuenta?</h2>
            <p className="text-sm text-gray-500 text-center mb-2">
              Esto borrará permanentemente:
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-1 pl-4 list-disc">
              <li>Tu perfil y nombre de usuario</li>
              <li>Todas tus predicciones y puntos</li>
              <li>Tu historial en todos los torneos</li>
            </ul>
            <p className="text-xs text-gray-400 text-center mb-6">
              Si volvés a crear una cuenta con el mismo email, empezarás desde cero sin ningún registro previo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteStep(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm text-ink-900 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setDeleteStep("slider")}
                className="flex-1 bg-red-600 hover:bg-red-500 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
              >
                Sí, continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Slider de confirmación ── */}
      {deleteStep === "slider" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />
          <div className="relative bg-white border border-red-200 rounded-2xl p-7 w-full max-w-sm shadow-[var(--shadow-pop)]">
            <h2 className="text-lg font-display font-extrabold text-ink-900 text-center mb-1">Última oportunidad</h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Esta acción no se puede deshacer.
            </p>

            {deleting ? (
              <div className="text-center text-gray-500 text-sm py-4">Eliminando cuenta...</div>
            ) : (
              <DeleteSlider onComplete={handleDeleteAccount} />
            )}

            <button
              onClick={() => setDeleteStep(null)}
              disabled={deleting}
              className="w-full mt-5 text-sm text-gray-400 hover:text-ink-900 transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Reautenticación ── */}
      {deleteStep === "reauth" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />
          <div className="relative bg-white border border-red-200 rounded-2xl p-7 w-full max-w-sm shadow-[var(--shadow-pop)]">
            <h2 className="text-lg font-display font-extrabold text-ink-900 text-center mb-1">Confirmá tu identidad</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Por seguridad, necesitamos verificar que sos vos.
            </p>

            {auth.currentUser?.providerData[0]?.providerId === "google.com" ? (
              <button
                onClick={handleReauth}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-ink-900 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {deleting ? "Verificando..." : "Confirmar con Google"}
              </button>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Tu contraseña"
                  value={reauthPassword}
                  onChange={(e) => setReauthPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReauth()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 mb-3"
                  autoFocus
                />
                {reauthError && <p className="text-red-600 text-sm mb-3">{reauthError}</p>}
                <button
                  onClick={handleReauth}
                  disabled={deleting || !reauthPassword}
                  className="w-full bg-red-600 hover:bg-red-500 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Eliminando..." : "Confirmar y eliminar"}
                </button>
              </>
            )}

            <button
              onClick={() => setDeleteStep(null)}
              disabled={deleting}
              className="w-full mt-4 text-sm text-gray-400 hover:text-ink-900 transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
