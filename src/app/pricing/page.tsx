import Script from "next/script";

// Add TypeScript support for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "pricing-table-id": string;
        "publishable-key": string;
      };
    }
  }
}

export default function PricingPage() {
  return (
    <>
      {/* Carga el web component de Stripe una vez que la página está interactiva */}
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      <main className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-6">Planes</h1>

        {/* El custom element se “activará” cuando cargue el script de arriba */}
        <stripe-pricing-table
          pricing-table-id="prctbl_1S0ThQ0tgW4pIzY1nQ6t3WCJ"
          publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_..."}
        />
      </main>
    </>
  );
}
