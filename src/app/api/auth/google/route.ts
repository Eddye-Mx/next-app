import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const APP_JWT_SECRET = new TextEncoder().encode(process.env.APP_JWT_SECRET!);

const client = new OAuth2Client(CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }

    // Verifica el ID token recibido del front
    const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const sub = payload.sub!; // ID estable del usuario en Google
    const email = payload.email || "";
    const name = payload.name || "";
    const picture = payload.picture || "";
    const email_verified = payload.email_verified || false;

    // TODO: busca/crea usuario en tu DB con `sub` como clave
    // await upsertUser({ sub, email, name, picture, email_verified })

    // Crea tu sesión propia (JWT firmada en cookie HttpOnly)
    const appJwt = await new SignJWT({ sub, email, name, picture })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(APP_JWT_SECRET);

    (await cookies()).set({
      name: "session",
      value: appJwt,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, user: { sub, email, name, picture, email_verified } });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Auth error" }, { status: 500 });
  }
}