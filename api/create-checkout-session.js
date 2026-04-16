import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: { name: "Test Product" },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: "https://sabr-store.vercel.app/success",
      cancel_url: "https://sabr-store.vercel.app/",
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
