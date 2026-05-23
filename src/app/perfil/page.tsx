"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, deleteUser } from "firebase/auth";
import { doc, updateDoc, deleteDoc, getDocs, collection, query, where, writeBatch } from "firebase/firestore";
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
      className="relative h-12 bg-red-950/40 border border-red-800/40 rounded-full select-none"
      style={{ touchAction: "none" }}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onEnd}
    >
      {/* Label */}
      <span className="absolute inset-0 flex items-center justify-center text-xs text-red-400/50 font-medium pointer-events-none pl-10">
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
  const fileRef = useRef<HTMLInputElement>(null);

  // Delete account state
  const [deleteStep, setDeleteStep] = useState<null | "warn" | "slider">(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) setDisplayName(user.displayName || "");
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

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

  async function handleDeleteAccount() {
    if (!user || !auth.currentUser) return;
    setDeleting(true);
    try {
      // Borrar todas las predicciones del usuario
      const predsSnap = await getDocs(query(collection(db, "predictions"), where("userId", "==", user.uid)));
      const batch = writeBatch(db);
      predsSnap.docs.forEach((d) => batch.delete(d.ref));
      // Borrar perfil de Firestore
      batch.delete(doc(db, "users", user.uid));
      await batch.commit();
      // Borrar cuenta de Firebase Auth (requiere sesión reciente)
      await deleteUser(auth.currentUser);
      router.push("/");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("recent")) {
        alert("Por seguridad, cerrá sesión y volvé a entrar antes de eliminar tu cuenta.");
      } else {
        alert("Error al eliminar la cuenta: " + msg);
      }
      setDeleting(false);
      setDeleteStep(null);
    }
  }

  if (loading || !user) return null;

  const currentPhoto = localPhoto ?? user.photoURL;

  return (
    <div className="max-w-md mx-auto py-10 px-4">

      {/* Toast */}
      <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {toast}
      </div>

      <h1 className="text-xl font-bold text-white mb-8">Mi perfil</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative group rounded-full"
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
        <p className="text-xs text-gray-500">Clic para cambiar la foto</p>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
      </div>

      {/* Datos */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500">Nombre de usuario</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-500">Email</label>
          <p className="text-sm text-gray-400 px-4 py-2.5">{user.email}</p>
        </div>
        <button
          onClick={handleSaveName}
          disabled={saving || !displayName.trim()}
          className="self-end bg-yellow-400 text-gray-900 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Zona peligrosa */}
      <div className="border border-red-900/40 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">Eliminar cuenta</p>
          <p className="text-xs text-gray-600 mt-0.5">Acción permanente e irreversible</p>
        </div>
        <button
          onClick={() => setDeleteStep("warn")}
          className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>

      {/* ── MODAL 1: Advertencia ── */}
      {deleteStep === "warn" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteStep(null)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-7 w-full max-w-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-full mb-4 mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white text-center mb-2">¿Eliminar tu cuenta?</h2>
            <p className="text-sm text-gray-400 text-center mb-2">
              Esto borrará permanentemente:
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-1 pl-4 list-disc">
              <li>Tu perfil y nombre de usuario</li>
              <li>Todas tus predicciones y puntos</li>
              <li>Tu historial en todos los torneos</li>
            </ul>
            <p className="text-xs text-gray-600 text-center mb-6">
              Si volvés a crear una cuenta con el mismo email, empezarás desde cero sin ningún registro previo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteStep(null)}
                className="flex-1 border border-gray-700 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition-colors"
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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-gray-900 border border-red-900/50 rounded-2xl p-7 w-full max-w-sm">
            <h2 className="text-lg font-bold text-white text-center mb-1">Última oportunidad</h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Esta acción no se puede deshacer.
            </p>

            {deleting ? (
              <div className="text-center text-gray-400 text-sm py-4">Eliminando cuenta...</div>
            ) : (
              <DeleteSlider onComplete={handleDeleteAccount} />
            )}

            <button
              onClick={() => setDeleteStep(null)}
              disabled={deleting}
              className="w-full mt-5 text-sm text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-40"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
