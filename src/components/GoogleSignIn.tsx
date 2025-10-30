"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: any;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function GoogleSignIn() {
  const btnRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Callback cuando Google devuelve el ID token (credential)
  const handleCredential = async (response: { credential: string }) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      // Aquí ya tienes la sesión creada en cookie HttpOnly
      // Actualiza UI, redirige o recarga
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar sesión");
    }
  };

  const init = () => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
      ux_mode: "popup", // opcional: "popup" | "redirect"
    });
    if (btnRef.current) {
      window.google.accounts.id.renderButton(btnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      });
    }
    // One Tap (opcional)
    window.google.accounts.id.prompt();
    setReady(true);
  };

  useEffect(() => {
    if (window.google) init();
  }, []);

  return (
    <div className="flex flex-col items-start gap-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={init}
      />
      <div ref={btnRef} />
      {!ready && <p>Cargando botón de Google…</p>}
    </div>
  );
}