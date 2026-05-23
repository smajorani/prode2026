"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import UserAvatar from "@/components/UserAvatar";

function resizeToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // Recorte cuadrado centrado, sin upscale
      const min = Math.min(img.width, img.height, 600);
      const canvas = document.createElement("canvas");
      canvas.width = min;
      canvas.height = min;
      const ctx = canvas.getContext("2d")!;
      const sx = (img.width - Math.min(img.width, img.height)) / 2;
      const sy = (img.height - Math.min(img.width, img.height)) / 2;
      const srcSize = Math.min(img.width, img.height);
      ctx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, min, min);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Datos */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4">
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
    </div>
  );
}
