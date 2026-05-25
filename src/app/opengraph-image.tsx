import { ImageResponse } from "next/og";

export const alt = "Prode Mundial 2026 — Pronosticá y competí con tus amigos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(135deg, #1f93da 0%, #0f5f90 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-6px",
              lineHeight: 1,
            }}
          >
            Prode
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#d4ebfb",
              letterSpacing: "8px",
              marginTop: 8,
            }}
          >
            MUNDIAL 2026
          </div>
          <div
            style={{
              marginTop: 38,
              fontSize: 34,
              color: "#eaf4fc",
              fontWeight: 500,
            }}
          >
            Pronosticá · Competí · Ganá
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 26,
              color: "#aedaf6",
            }}
          >
            prode2026.ar
          </div>
        </div>

        <svg width="320" height="320" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="15" fill="#ffffff" />
          <g fill="none" stroke="#1f93da" strokeWidth="1.6" strokeLinecap="round">
            <line x1="16" y1="11.4" x2="16" y2="2.2" />
            <line x1="20.38" y1="14.58" x2="29.4" y2="11.7" />
            <line x1="18.7" y1="19.72" x2="24.2" y2="27.4" />
            <line x1="13.3" y1="19.72" x2="7.8" y2="27.4" />
            <line x1="11.62" y1="14.58" x2="2.6" y2="11.7" />
          </g>
          <path
            d="M16 11.4 L20.38 14.58 L18.7 19.72 L13.3 19.72 L11.62 14.58 Z"
            fill="#1f93da"
          />
        </svg>
      </div>
    ),
    size
  );
}
