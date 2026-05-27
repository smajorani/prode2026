"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SupportModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/galio/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Error al generar el link de pago");
        setLoading(false);
      }
    } catch {
      alert("Error al generar el link de pago");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 border border-gray-200">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-ink-900 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-display font-extrabold text-ink-900 mb-1">Sin anuncios para siempre</h2>
        <p className="text-sm text-gray-500 mb-6">
          Hacé una contribución única y los anuncios desaparecen permanentemente de tu cuenta.
        </p>

        <label className="text-xs font-semibold text-gray-500 mb-2 block">Monto (ARS)</label>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
            <input
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Math.max(100, Number(e.target.value)))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <button
            onClick={handlePay}
            disabled={loading || amount < 100}
            className="bg-yellow-400 hover:bg-yellow-500 text-ink-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {loading ? "..." : "Pagar →"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400">Mínimo $100 ARS · Pago único · Sin renovación</p>
      </div>
    </div>
  );
}
