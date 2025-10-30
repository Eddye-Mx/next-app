import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set({ name: "session", value: "", httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}