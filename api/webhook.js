import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const event = req.body;

    // 💥 ONLY SUCCESSFUL PAYMENT
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details?.email;

      console.log("PAYMENT SUCCESS:", email);

      // 🚀 SEND TO BASE44 (replace later)
      await fetch("https://YOUR-BASE44-API.com/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          access: "premium",
        }),
      });
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
