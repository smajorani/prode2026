import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.GALIOPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  if (payload.status === "approved" && payload.referenceId) {
    await adminDb.collection("users").doc(payload.referenceId).update({
      supporter: true,
    });
  }

  if (payload.status === "refunded" && payload.referenceId) {
    await adminDb.collection("users").doc(payload.referenceId).update({
      supporter: false,
    });
  }

  return NextResponse.json({ ok: true });
}
