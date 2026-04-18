import Stripe from "stripe";

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { cart } = req.body;

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.qty || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "https://sabrskinco.base44.app/success",
      cancel_url: "https://sabrskinco.base44.app/",
    });

    return res.json({ url: session.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
