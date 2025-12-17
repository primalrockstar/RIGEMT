import { loadStripe } from '@stripe/stripe-js';

// Ensure this uses your LIVE Publishable Key (pk_live_...)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRODUCTS = {
  // Premium Monthly ($24.99)
  MONTHLY: 'price_1SdBdKJyVTqxIiexTvFFcXEy', 
  
  // Semester Pass ($120)
  SEMESTER: 'price_1SdBlTJyVTqxIiexmjK8S0Cn' 
};

export default function Pricing() {
  const handleCheckout = async (priceId: string) => {
    try {
      // Point this to your live backend URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_id: priceId }),
      });

      const session = await response.json();

      if (session.error) {
        console.error('Server Error:', session.error);
        return;
      }

      const stripe = await stripePromise;
      const { error } = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) console.error('Stripe Error:', error);
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
      {/* MONTHLY CARD */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2">Monthly</h3>
        <p className="text-3xl font-mono text-white mb-6">$24.99<span className="text-sm text-gray-400">/mo</span></p>
        <button 
          onClick={() => handleCheckout(PRODUCTS.MONTHLY)}
          className="bg-slate-700 text-white px-6 py-3 rounded hover:bg-slate-600 transition-colors w-full font-bold"
        >
          Subscribe
        </button>
      </div>

      {/* SEMESTER CARD */}
      <div className="bg-slate-800 p-6 rounded-xl border-2 border-neon-500 relative flex flex-col items-center">
        <div className="absolute -top-3 bg-neon-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
          BEST VALUE
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">Semester Pass</h3>
        <p className="text-3xl font-mono text-neon-400 mb-6">$79.99<span className="text-sm text-gray-400">/6mo</span></p>
        <button 
          onClick={() => handleCheckout(PRODUCTS.SEMESTER)}
          className="bg-neon-500 text-slate-900 px-6 py-3 rounded hover:bg-neon-400 transition-colors w-full font-bold"
        >
          Get Access
        </button>
      </div>
    </div>
  );
}