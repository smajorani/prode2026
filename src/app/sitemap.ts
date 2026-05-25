import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://prode2026.ar";
  const now = new Date();
  return [
    { url: `${base}/`,        lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/fixture`, lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/login`,   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
