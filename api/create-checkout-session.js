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
    // 🔥 HARD CHECK (prevents Stripe crashing with undefined key)
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error("❌ STRIPE_SECRET_KEY missing in Vercel");
      return res.status(500).json({
        error: "Server misconfigured (missing Stripe key)",
      });
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "Test Product",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
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
