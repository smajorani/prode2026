import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/fixture"],
      disallow: ["/admin", "/perfil", "/mis-predicciones", "/torneos"],
    },
    sitemap: "https://prode2026.ar/sitemap.xml",
    host: "https://prode2026.ar",
  };
}
