import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("🔥 API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { cart } = req.body;

    console.log("📦 CART:", cart);

    if (!cart?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name || "Item",
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: "https://sabr-store.vercel.app/success",
      cancel_url: "https://sabr-store.vercel.app/",
    });

    console.log("✅ SESSION CREATED");

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("❌ STRIPE ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
