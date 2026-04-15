import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart = [] } = req.body || {};

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Invalid cart" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity || 1,
      })),
      success_url: "https://YOUR-SITE.vercel.app/success",
      cancel_url: "https://YOUR-SITE.vercel.app/cancel",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
