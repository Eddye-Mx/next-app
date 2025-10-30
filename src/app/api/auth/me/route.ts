import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const APP_JWT_SECRET = new TextEncoder().encode(process.env.APP_JWT_SECRET!);

export async function GET() {
  try {
    const cookie = (await cookies()).get("session");
    if (!cookie) return NextResponse.json({ authenticated: false });

    const { payload } = await jwtVerify(cookie.value, APP_JWT_SECRET);
    return NextResponse.json({ authenticated: true, user: payload });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}