"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthCatcher() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return;
    }

    if (!code) return;

    (async () => {
      try {
        const res = await fetch("http://localhost:8080/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!res.ok) {
          const msg = await res.text();
          console.error("Token exchange failed:", msg);
          return;
        }

        // (Opcional) Redirige a un dashboard o limpia la URL
        router.replace("/");
      } catch (e) {
        console.error("Exchange request failed:", e);
      }
    })();
  }, [searchParams, router]);

  return null;
}
