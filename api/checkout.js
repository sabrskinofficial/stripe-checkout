import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("API HIT");
  console.log("METHOD:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart = [] } = req.body || {};

    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Cart invalid" });
    }

    const total = cart.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }, 0);

    const amount = Math.round(total * 100);

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
      success_url: "https://your-site.com/success",
      cancel_url: "https://your-site.com/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
}
