import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const session = await stripe.checkout.sessions.create({
    success_url: "https://v0-add-checkout-api.vercel.app/",
    cancel_url: "https://v0-add-checkout-api.vercel.app/",
    mode: "payment",
    line_items: [
      {
        price: "price_1TKVwQAkM9ylghX1wXUGABNa",
        quantity: 1,
      },
    ],
  });

  return Response.json({ url: session.url });
}
// redeploy trigger
