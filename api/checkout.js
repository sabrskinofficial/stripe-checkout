import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
  if (!amount || isNaN(amount)) {
  return res.status(400).json({ error: "Invalid amount", received: req.query.amount });
}

const amount = parseFloat(String(req.query.amount).replace(/[^0-9.]/g, ""));

    if (!amountRaw || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "BASE44 Product",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    return res.redirect(303, session.url);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
