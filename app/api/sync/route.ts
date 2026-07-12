import { NextRequest, NextResponse } from "next/server";
import { runSync } from "../../../scripts/sync";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sync-secret");
  if (!secret || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Sync route failed:", err);
    return NextResponse.json({ error: "sync failed" }, { status: 502 });
  }
}
