import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
  
    const amountRaw = req.query.amount;
    const amount = Number(amountRaw);

    console.log("RAW AMOUNT:", amountRaw);
    console.log("PARSED AMOUNT:", amount);

    if (!amountRaw || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
        received: amountRaw,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "SABR SKIN ORDER",
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
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
