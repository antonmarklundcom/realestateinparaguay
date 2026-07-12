import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { leads } from "../../../lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message, listingRef, page, locale } = body;

  if (!name || !message) {
    return NextResponse.json(
      { error: "name and message are required" },
      { status: 400 },
    );
  }

  // Local insert first — never lose a lead even if INM is unreachable.
  await db.insert(leads).values({
    name,
    email: email ?? null,
    phone: phone ?? null,
    message,
    listingRef: listingRef ?? null,
    page: page ?? null,
    locale: locale === "es" ? "es" : "en",
  });

  // Best-effort forward to INM's single admin inbox. Non-blocking failure.
  const forwardUrl = process.env.LEADS_FORWARD_URL;
  const forwardToken = process.env.LEADS_FORWARD_TOKEN;
  if (forwardUrl && forwardToken) {
    fetch(forwardUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forwardToken}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        listing_ref: listingRef,
        page,
        source: "reip",
      }),
    }).catch((err) => console.error("Lead forward to INM failed:", err));
  }

  return NextResponse.json({ ok: true });
}
