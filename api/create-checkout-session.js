import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

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
    const { name, price } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
