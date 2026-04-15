import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const cart = [
    { name: "Product 1", price: 25, quantity: 1 },
  ];

  async function handleCheckout() {
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Checkout</h1>

      <p>Total: $25.00</p>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Loading..." : "Pay Now"}
      </button>
    </div>
  );
}
