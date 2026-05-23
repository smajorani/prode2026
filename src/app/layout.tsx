import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TournamentProvider } from "@/context/TournamentContext";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prode Mundial 2026",
  description: "Pronosticá los partidos del Mundial 2026 y competí con tus amigos",
  openGraph: {
    title: "Prode Mundial 2026",
    description: "Pronosticá los partidos del Mundial 2026",
    siteName: "prode2026.ar",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.className} min-h-screen`}>
        <AuthProvider>
          <TournamentProvider>
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
          </TournamentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
