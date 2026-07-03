import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FREE_SHIP_THRESHOLD, DELIVERY_FEE } from "../data/catalog.js";
import { Cart, Orders } from "../lib/db.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { money, deliveryDate, confettiBurst } from "../lib/utils.js";

const STEPS = ["Address", "Payment", "Review"];

function Steps({ step }) {
  return (
    <div className="checkout-steps">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const cls = n < step ? "done" : n === step ? "active" : "";
        return (
          <span key={label} style={{ display: "contents" }}>
            {i > 0 && <span className="step-line" />}
            <span className={`step ${cls}`}>
              <span className="dot">{n < step ? "✓" : n}</span>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function Summary({ items, delivery, total, freeShip }) {
  return (
    <aside className="summary-box">
      <h3>Order Summary</h3>
      {items.map(({ product: p, qty }) => (
        <div className="sum-row" key={p.id}>
          <span>{p.name.slice(0, 26)}… × {qty}</span>
          <span>{money(p.price * qty)}</span>
        </div>
      ))}
      <div className="sum-row"><span>Delivery</span><span className={freeShip ? "free" : ""}>{freeShip ? "FREE" : money(delivery)}</span></div>
      <div className="sum-row total"><span>Order Total</span><span>{money(total)}</span></div>
    </aside>
  );
}

export default function Checkout() {
  const { user, updateUser } = useAuth();
  const { bump } = useShop();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);

  const [addr, setAddr] = useState(() => ({
    name: user?.address?.name || user?.name || "",
    phone: user?.address?.phone || "",
    pin: user?.address?.pin || "",
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
  }));
  const setA = (k) => (e) => setAddr((a) => ({ ...a, [k]: e.target.value }));

  const [pay, setPay] = useState("card");
  const [card, setCard] = useState({ num: "", exp: "", cvv: "", name: "", upi: "" });

  const items = Cart.detailed();

  if (placed) {
    return (
      <div className="order-success">
        <div className="check">✓</div>
        <h1>Order placed, thank you!</h1>
        <p>Confirmation will be sent to your email. Arriving by <b>{deliveryDate(2)}</b>.</p>
        <div className="oid">Order ID: {placed.id}</div>
        <div className="os-actions">
          <Link to="/orders" className="btn btn-primary">Track your order</Link>
          <Link to="/" className="btn btn-ghost">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (!items.length) return <Navigate to="/cart" replace />;

  const sub = Cart.subtotal();
  const freeShip = sub >= FREE_SHIP_THRESHOLD;
  const delivery = freeShip ? 0 : DELIVERY_FEE;
  const total = sub + delivery;

  /* ---------- step 1: address ---------- */
  const submitAddress = (e) => {
    e.preventDefault();
    setError("");
    if (Object.values(addr).some((v) => !v.trim())) return setError("Please fill all the fields.");
    if (!/^\d{10}$/.test(addr.phone)) return setError("Mobile number must be 10 digits.");
    if (!/^\d{6}$/.test(addr.pin)) return setError("PIN code must be 6 digits.");
    updateUser({ address: { ...addr } });
    setStep(2);
    window.scrollTo(0, 0);
  };

  /* ---------- step 2: payment ---------- */
  const formatCardNum = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v) => {
    let d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const submitPayment = () => {
    setError("");
    if (pay === "card") {
      const num = card.num.replace(/\s/g, "");
      if (num.length !== 16) return setError("Card number must be 16 digits.");
      if (!/^\d{2}\/\d{2}$/.test(card.exp)) return setError("Enter expiry as MM/YY.");
      if (card.cvv.length !== 3) return setError("CVV must be 3 digits.");
      if (!card.name.trim()) return setError("Enter the name on the card.");
    }
    if (pay === "upi" && !/^[\w.\-]{2,}@[a-z]{2,}$/i.test(card.upi.trim())) {
      return setError("Enter a valid UPI ID (e.g. name@upi).");
    }
    setStep(3);
    window.scrollTo(0, 0);
  };

  const payLabel =
    pay === "card" ? `Card ending •••• ${card.num.replace(/\s/g, "").slice(-4)}`
    : pay === "upi" ? `UPI — ${card.upi.trim()}`
    : "Cash on Delivery";

  /* ---------- step 3: place order ---------- */
  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = Orders.place({
        items: items.map(({ product: p, qty }) => ({ id: p.id, name: p.name, art: p.art, bg: p.bg, price: p.price, qty })),
        amounts: { sub, delivery, total },
        address: { ...addr },
        payment: payLabel,
      });
      Cart.clear();
      bump();
      setPlaced(order);
      confettiBurst();
      window.scrollTo(0, 0);
    }, 900);
  };

  return (
    <div className="container">
      <Steps step={step} />
      <div className="checkout-layout">
        {step === 1 && (
          <section className="checkout-panel">
            <h2>1. Delivery address</h2>
            <form className="form-grid" onSubmit={submitAddress} noValidate>
              <label className="field span2"><span>Full name</span><input required value={addr.name} onChange={setA("name")} /></label>
              <label className="field"><span>Mobile number</span><input required inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={addr.phone} onChange={setA("phone")} /></label>
              <label className="field"><span>PIN code</span><input required inputMode="numeric" maxLength={6} placeholder="6-digit PIN" value={addr.pin} onChange={setA("pin")} /></label>
              <label className="field span2"><span>Flat, house no., building</span><input required value={addr.line1} onChange={setA("line1")} /></label>
              <label className="field span2"><span>Area, street, landmark</span><input required value={addr.line2} onChange={setA("line2")} /></label>
              <label className="field"><span>City</span><input required value={addr.city} onChange={setA("city")} /></label>
              <label className="field"><span>State</span><input required value={addr.state} onChange={setA("state")} /></label>
              <p className="auth-error">{error}</p>
              <div className="span2"><button className="btn btn-primary" type="submit">Deliver to this address →</button></div>
            </form>
          </section>
        )}

        {step === 2 && (
          <section className="checkout-panel">
            <h2>2. Payment method</h2>
            <div className="pay-methods">
              <label className={`pay-method ${pay === "card" ? "selected" : ""}`}>
                <input type="radio" name="pay" checked={pay === "card"} onChange={() => setPay("card")} />
                <span>
                  <strong>💳 Credit / Debit card</strong>
                  <small>Visa, Mastercard, RuPay accepted</small>
                  {pay === "card" && (
                    <div className="card-fields">
                      <label className="field"><span>Card number</span>
                        <input inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19}
                               value={card.num} onChange={(e) => setCard((c) => ({ ...c, num: formatCardNum(e.target.value) }))} />
                      </label>
                      <div className="form-grid">
                        <label className="field"><span>Expiry (MM/YY)</span>
                          <input placeholder="MM/YY" maxLength={5}
                                 value={card.exp} onChange={(e) => setCard((c) => ({ ...c, exp: formatExp(e.target.value) }))} />
                        </label>
                        <label className="field"><span>CVV</span>
                          <input type="password" inputMode="numeric" maxLength={3} placeholder="•••"
                                 value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "") }))} />
                        </label>
                      </div>
                      <label className="field"><span>Name on card</span>
                        <input placeholder="As printed on card" value={card.name}
                               onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
                      </label>
                    </div>
                  )}
                </span>
              </label>

              <label className={`pay-method ${pay === "upi" ? "selected" : ""}`}>
                <input type="radio" name="pay" checked={pay === "upi"} onChange={() => setPay("upi")} />
                <span>
                  <strong>📲 UPI</strong>
                  <small>GPay, PhonePe, Paytm & more</small>
                  {pay === "upi" && (
                    <div className="card-fields">
                      <label className="field"><span>UPI ID</span>
                        <input placeholder="yourname@upi" value={card.upi}
                               onChange={(e) => setCard((c) => ({ ...c, upi: e.target.value }))} />
                      </label>
                    </div>
                  )}
                </span>
              </label>

              <label className={`pay-method ${pay === "cod" ? "selected" : ""}`}>
                <input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} />
                <span><strong>💵 Cash on Delivery</strong><small>Pay in cash or UPI when your order arrives</small></span>
              </label>
            </div>
            <p className="auth-error">{error}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={submitPayment}>Use this payment method →</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="checkout-panel">
            <h2>3. Review your order</h2>
            <div className="review-block">
              <button className="link-btn edit" onClick={() => setStep(1)}>Change</button>
              <h4>Delivering to</h4>
              <b>{addr.name}</b> · {addr.phone}<br />
              {addr.line1}, {addr.line2},<br />
              {addr.city}, {addr.state} — {addr.pin}
            </div>
            <div className="review-block">
              <button className="link-btn edit" onClick={() => setStep(2)}>Change</button>
              <h4>Paying with</h4>
              <b>{payLabel}</b>
            </div>
            <div className="review-block">
              <h4>Items · arriving by {deliveryDate(2)}</h4>
              {items.map(({ product: p, qty }) => (
                <div className="review-item" key={p.id}>
                  <span className="ri-thumb" style={{ background: p.bg }}>{p.art}</span>
                  {p.name.slice(0, 46)}… × {qty}
                  <b>{money(p.price * qty)}</b>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-block" style={{ fontSize: 16, padding: 13 }}
                    disabled={placing} onClick={placeOrder}>
              {placing ? "Placing your order…" : `Place your order — ${money(total)}`}
            </button>
            <p className="auth-fineprint">
              By placing this order you agree to NovaKart's conditions of use. This is a demo — no real payment happens.
            </p>
          </section>
        )}

        <Summary items={items} delivery={delivery} total={total} freeShip={freeShip} />
      </div>
    </div>
  );
}
