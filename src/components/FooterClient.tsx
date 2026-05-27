"use client";

import Link from "next/link";
import SupporterAdBanner from "@/components/SupporterAdBanner";

export default function FooterClient() {
  return (
    <footer className="max-w-5xl mx-auto px-4 pb-8">
      <SupporterAdBanner className="mb-5 rounded-xl overflow-hidden" />
      <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
        <span>© 2026 Prode Mundial 2026</span>
        <div className="flex gap-4">
          <Link href="/privacidad" className="hover:text-gray-600 transition-colors">Política de Privacidad</Link>
          <Link href="/como-funciona" className="hover:text-gray-600 transition-colors">¿Cómo funciona?</Link>
        </div>
      </div>
    </footer>
  );
}
