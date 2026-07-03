import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Orders } from "../lib/db.js";
import { money } from "../lib/utils.js";

const ORDER_STEPS = ["Ordered", "Shipped", "Out for delivery", "Delivered"];

export default function OrdersPage() {
  /* re-render every 15s so simulated statuses advance live */
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const orders = Orders.list();

  return (
    <div className="container">
      <h1 className="page-title">📦 Your Orders</h1>
      {orders.length ? (
        orders.map((o, i) => {
          const s = Orders.status(o);
          return (
            <div className="order-card" key={o.id} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="order-head">
                <span>
                  Order placed
                  <b>{new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</b>
                </span>
                <span>Total<b>{money(o.amounts.total)}</b></span>
                <span>Ship to<b>{o.address.name}</b></span>
                <span className="oh-id">Order # <b>{o.id}</b></span>
              </div>
              <div className="order-body">
                <p className={`order-status ${s === 3 ? "delivered" : "transit"}`}>
                  {s === 3 ? "✅ Delivered" : `🚚 ${ORDER_STEPS[s]}`}
                </p>
                <small style={{ color: "var(--ink-soft)" }}>
                  {o.payment} · {o.items.length} item{o.items.length > 1 ? "s" : ""}
                </small>
                <div className="timeline">
                  {ORDER_STEPS.map((step, si) => (
                    <span key={step} style={{ display: "contents" }}>
                      <span className={`tl-node ${si <= s ? "done" : ""}`}><span>{step}</span></span>
                      {si < ORDER_STEPS.length - 1 && <span className={`tl-bar ${si < s ? "done" : ""}`} />}
                    </span>
                  ))}
                </div>
                <div className="order-items">
                  {o.items.map((it) => (
                    <div className="oi" key={it.id}>
                      <span style={{ background: it.bg, borderRadius: 8, padding: "2px 6px" }}>{it.art}</span>
                      {it.name.slice(0, 34)}… × {it.qty}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="e-art">📦</div>
          <h3>No orders yet</h3>
          <p>Your orders will appear here once you place them. Order status updates live — Ordered → Shipped → Delivered.</p>
          <Link to="/" className="btn btn-primary">Start shopping</Link>
        </div>
      )}
    </div>
  );
}
