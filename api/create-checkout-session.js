import Stripe from "stripe";

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ MOVE HERE

  res.setHeader("Access-Control-Allow-Origin", "https://sabrskinco.base44.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { cart } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cart.map((item) => {
      const price = Number(item.price);

      if (!item.name) throw new Error("Missing product name");
      if (!price || isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for: ${item.name}`);
      }

      return {
        price_data: {
          currency: "aud",
          product_data: { name: item.name },
          unit_amount: Math.round(price * 100),
        },
        quantity: Number(item.qty) || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_payment_methods: { enabled: true },
      line_items,
      success_url:
        "https://sabrskinco.base44.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://sabrskinco.base44.app/",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("🔥 STRIPE ERROR FULL:", err);

    return res.status(500).json({
      error: err.message || "Stripe checkout failed",
    });
  }
}
