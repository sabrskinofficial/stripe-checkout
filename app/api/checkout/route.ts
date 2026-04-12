import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST() {
  try {
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

    return Response.json({ url: session.url });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
// redeploy trigger
