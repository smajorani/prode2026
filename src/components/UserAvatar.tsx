"use client";

import { useState } from "react";

const COLORS = [
  "#60A5FA", // celeste
  "#FB923C", // naranja
  "#4ADE80", // verde
  "#C4956A", // marrón suave
  "#A78BFA", // violeta
  "#2DD4BF", // turquesa
  "#F472B6", // rosa
  "#86EFAC", // verde menta
  "#FCD34D", // amarillo
  "#818CF8", // índigo
  "#6EE7B7", // esmeralda
  "#FCA5A5", // rojo suave
];

function getColor(uid: string): string {
  const sum = uid.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

interface UserAvatarProps {
  uid: string;
  photoURL?: string | null;
  size?: number;
  className?: string;
}

function ColoredAvatar({ uid, size, className }: { uid: string; size: number; className: string }) {
  return (
    <div
      className={`rounded-full flex-shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size, backgroundColor: getColor(uid) }}
    >
      <svg viewBox="0 0 24 24" fill="white" style={{ width: size * 0.6, height: size * 0.6 }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
      </svg>
    </div>
  );
}

export default function UserAvatar({ uid, photoURL, size = 36, className = "" }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt=""
        width={size}
        height={size}
        className={`rounded-full object-cover flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    );
  }

  return <ColoredAvatar uid={uid} size={size} className={className} />;
}
