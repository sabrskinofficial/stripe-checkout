import Stripe from "stripe";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    // 🔥 SAFE STRIPE INIT (this prevents your API key crash)
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        error: "Missing STRIPE_SECRET_KEY in Vercel environment",
      });
    }

    const stripe = new Stripe(secretKey);

    // 🧺 OPTIONAL: cart from frontend (or fallback test item)
    const { cart } = req.body || {};

    const line_items =
      Array.isArray(cart) && cart.length > 0
        ? cart.map((item) => ({
            price_data: {
              currency: "aud",
              product_data: {
                name: item.name || "Product",
              },
              unit_amount: Math.round(Number(item.price || 0) * 100),
            },
            quantity: Number(item.qty || 1),
          }))
        : [
            // fallback so it NEVER breaks
            {
              price_data: {
                currency: "aud",
                product_data: { name: "Test Product" },
                unit_amount: 1000,
              },
              quantity: 1,
            },
          ];

    // 💳 STRIPE SESSION (THIS IS THE PART YOU ASKED ABOUT)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "https://sabrskinco.base44.app/success",
      cancel_url: "https://sabrskinco.base44.app/",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("🔥 STRIPE ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
