import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      keyExists: !!process.env.STRIPE_SECRET_KEY
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
