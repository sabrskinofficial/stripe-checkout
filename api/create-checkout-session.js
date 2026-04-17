import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { cart } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: cart.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: { name: item.name },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.qty || 1,
      })),

      success_url:
        "https://sabrskinco.base44.app/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "https://sabrskinco.base44.app/",
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
