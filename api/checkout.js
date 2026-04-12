import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: "https://v0-add-checkout-api.vercel.app/",
    cancel_url: "https://v0-add-checkout-api.vercel.app/",
    line_items: [
      {
        price: "price_1TKVwQAkM9ylghX1wXUGABNa",
        quantity: 1,
      },
    ],
  });

  return res.status(200).json({ url: session.url });
}
