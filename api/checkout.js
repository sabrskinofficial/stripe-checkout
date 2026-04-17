import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart } = req.body;

    // ✅ Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Invalid cart" });
    }

    // ✅ Create line items
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name || "Item",
        },
        unit_amount: Math.round(Number(item.price || 0) * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,

     
      success_url:
        "https://sabrskinco.base44.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://sabrskinco.base44.app/",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("❌ Stripe error:", err);
    return res.status(500).json({
      error: err.message || "Stripe checkout failed",
    });
  }
}
