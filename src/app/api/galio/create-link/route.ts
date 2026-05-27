import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://pay.galio.app/api";

export async function POST(req: NextRequest) {
  const { uid, amount: rawAmount } = await req.json();
  if (!uid || typeof uid !== "string") {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }
  const amount = Math.max(100, Math.floor(Number(rawAmount) || 1000));

  const apiKey = process.env.GALIOPAY_API_KEY;
  const clientId = process.env.GALIOPAY_CLIENT_ID;
  const webhookSecret = process.env.GALIOPAY_WEBHOOK_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://prode2026.ar";

  if (!apiKey || !clientId) {
    return NextResponse.json({ error: "Pagos no configurados" }, { status: 503 });
  }

  const res = await fetch(`${API_BASE}/payment-links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "x-client-id": clientId,
    },
    body: JSON.stringify({
      items: [{
        title: "Prode 2026 — Sin anuncios",
        quantity: 1,
        unitPrice: amount,
        currencyId: "ARS",
      }],
      referenceId: uid,
      notificationUrl: `${appUrl}/api/galio/webhook?secret=${webhookSecret}`,
      backUrl: {
        success: `${appUrl}/perfil?supporter=ok`,
        failure: `${appUrl}/perfil`,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.error ?? "Error al crear el link de pago" }, { status: res.status });
  }
  return NextResponse.json({ url: data.url });
}
