"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import AdBanner from "@/components/AdBanner";

function useIsSupporter() {
  const { user } = useAuth();
  const [isSupporter, setIsSupporter] = useState(false);

  useEffect(() => {
    if (!user) { setIsSupporter(false); return; }
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setIsSupporter(snap.data()?.supporter === true);
    });
    return unsub;
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  return isSupporter;
}

export default function SupporterAdBanner({ className = "" }: { className?: string }) {
  const isSupporter = useIsSupporter();
  if (isSupporter) return null;
  return <AdBanner className={className} />;
}
