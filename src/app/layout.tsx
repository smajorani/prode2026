import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TournamentProvider } from "@/context/TournamentContext";
import Navbar from "@/components/Navbar";
import AdBanner from "@/components/AdBanner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL("https://prode2026.ar"),
  title: {
    default: "Prode Mundial 2026 — Pronosticá y competí con tus amigos",
    template: "%s · Prode 2026",
  },
  description:
    "Pronosticá los 104 partidos del Mundial 2026, sumá puntos por cada acierto y competí en torneos privados con tus amigos. Tabla en vivo, fixture completo y predicciones bonus.",
  applicationName: "Prode 2026",
  keywords: [
    "prode", "prode mundial 2026", "mundial 2026", "world cup 2026",
    "pronósticos", "fixture mundial 2026", "torneo de prode", "predicciones fútbol",
    "prode online", "prode amigos", "Argentina mundial 2026",
  ],
  authors: [{ name: "Prode 2026" }],
  creator: "Prode 2026",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://prode2026.ar",
    siteName: "Prode Mundial 2026",
    title: "Prode Mundial 2026 — Pronosticá y competí con tus amigos",
    description:
      "Pronosticá los 104 partidos del Mundial 2026 y competí en torneos privados. Tabla en vivo y fixture completo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prode Mundial 2026",
    description:
      "Pronosticá los 104 partidos del Mundial 2026 y competí con tus amigos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "sports",
};

export const viewport: Viewport = {
  themeColor: "#1f93da",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable} ${sora.variable}`}>
      <head>
        {adsenseClient && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <TournamentProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-7 sm:py-10">{children}</main>
            <footer className="max-w-5xl mx-auto px-4 pb-8">
              <AdBanner className="mb-5 rounded-xl overflow-hidden" />
              <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <span>© 2026 Prode Mundial 2026</span>
                <div className="flex gap-4">
                  <Link href="/privacidad" className="hover:text-gray-600 transition-colors">Política de Privacidad</Link>
                  <Link href="/como-funciona" className="hover:text-gray-600 transition-colors">¿Cómo funciona?</Link>
                </div>
              </div>
            </footer>
          </TournamentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
