import Image from "next/image";
import OAuthCatcher from "@/components/OAuthCatcher";
import GoogleSignIn from "@/components/GoogleSignIn";

// Add custom element type for 'stripe-pricing-table'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'pricing-table-id': string;
        'publishable-key': string;
      };
    }
  }
}

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Monta el catcher para leer ?code= y disparar el POST */}
      <OAuthCatcher />

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center sm:text-left">
          Create Next App
        </h1>

         <h1>Demo — Sign in with Google (GIS)</h1>
      <GoogleSignIn />
      <hr style={{ margin: "24px 0" }} />
      <pre>
        <MeBlock />
      </pre>
        {/* ... (resto de tu contenido) ... */}

        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=928454153831-ir24ehc6cqvstg265pk98o7bouf8e7ok.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost:3000&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fanalytics.readonly&access_type=offline&include_granted_scopes=true&prompt=consent&state=testing">
          login
        </a>

        <a href="https://billing.stripe.com/p/login/test_7sYcMXgLB6lMb1p3qn4AU00">maneja tu membresía</a>

        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table pricing-table-id="prctbl_1S0ThQ0tgW4pIzY1nQ6t3WCJ"
publishable-key="pk_test_51S08Rs0tgW4pIzY1yZpxl5TkP4hdghmdlvEGV4CSR4XPGYZZegUQ9TRTNmrXa4JAQzEeJG41vZPrTBluWwJrplxM00fLiLshE7">
</stripe-pricing-table>

        {/* ... (resto de tu contenido) ... */ }
      </main>
      {/* footer igual */}
    </div>
  );
}

// Server Component que consulta /api/auth/me
async function MeBlock() {
  const res = await fetch("http://localhost:3000/api/auth/me", { cache: "no-store" });
  const me = await res.json();
  return <code>{JSON.stringify(me, null, 2)}</code>;
}
