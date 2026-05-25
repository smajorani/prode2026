import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prode Mundial 2026",
    short_name: "Prode 2026",
    description: "Pronosticá los 104 partidos del Mundial 2026 y competí con tus amigos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7fb",
    theme_color: "#1f93da",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
