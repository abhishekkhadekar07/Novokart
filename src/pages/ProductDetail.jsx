import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS, REVIEW_SNIPPETS, FREE_SHIP_THRESHOLD } from "../data/catalog.js";
import { ProductCard } from "../components/shared.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { Wishlist } from "../lib/db.js";
import { money, stars, discountPct, deliveryDate } from "../lib/utils.js";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWish, version } = useShop();
  const [qty, setQty] = useState(1);
  const [art, setArt] = useState(null);
  const heroRef = useRef(null);
  void version;

  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="container empty-state">
        <div className="e-art">🫥</div>
        <h3>Product not found</h3>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === p.cat);
  const wished = Wishlist.has(p.id);
  const thumbs = [p.art, cat?.art || "📦", "🎁", "📦"];
  const shown = art || p.art;
  const clamp = (v) => Math.max(1, Math.min(v, Math.max(p.stock, 1)));
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 6);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link> › <Link to={`/category/${p.cat}`}>{cat?.name || p.cat}</Link> › <b>{p.brand}</b>
      </div>

      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-hero" ref={heroRef} style={{ background: p.bg }}>{shown}</div>
          <div className="pd-thumbs">
            {thumbs.map((a, i) => (
              <button key={i} className={shown === a && (i === 0 || a !== p.art) ? "active" : i === 0 && shown === p.art ? "active" : ""} onClick={() => setArt(a)}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="pd-info">
          <span className="pd-brand">Visit the {p.brand} Store</span>
          <h1>{p.name}</h1>
          <div className="p-rating">
            <span className="stars">{stars(p.rating)}</span> {p.rating}{" "}
            <small>· {p.reviews.toLocaleString("en-IN")} ratings</small>
          </div>
          <hr className="pd-divider" />
          <div className="pd-price-row">
            <span className="off">-{discountPct(p)}%</span>
            <span className="now"><sup>₹</sup>{p.price.toLocaleString("en-IN")}</span>
          </div>
          <div className="pd-price-row">
            <span className="mrp">M.R.P.: <s>{money(p.mrp)}</s> · Inclusive of all taxes</span>
          </div>
          {p.plus && <div className="pd-plus-note">✦ nova+ — FREE One-Day Delivery & exclusive deals</div>}
          <hr className="pd-divider" />
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>About this item</h3>
          <ul className="pd-about">{p.about.map((a) => <li key={a}>{a}</li>)}</ul>
          <hr className="pd-divider" />
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Product details</h3>
          <dl className="pd-specs">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <hr className="pd-divider" />
          <section className="reviews">
            <h3 style={{ fontSize: 16 }}>Customer reviews</h3>
            <div className="rating-summary">
              <span className="big">{p.rating}</span>
              <div>
                <span className="stars" style={{ fontSize: 17 }}>{stars(p.rating)}</span>
                <br />
                <small>{p.reviews.toLocaleString("en-IN")} global ratings</small>
              </div>
            </div>
            {REVIEW_SNIPPETS.map((r) => (
              <div className="review" key={r.name}>
                <div className="r-head">
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 12 }}>{r.name[0]}</div>
                  <strong>{r.name}</strong>
                  <span className="stars">{stars(r.stars)}</span>
                </div>
                <strong style={{ fontSize: 13 }}>{r.title}</strong>
                <p>{r.body}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="buy-box">
          <span className="now">{money(p.price)}</span>
          <span className="p-deliver">
            M.R.P: <s>{money(p.mrp)}</s>{" "}
            <span className="off" style={{ color: "var(--success)", fontWeight: 700 }}>Save {money(p.mrp - p.price)}</span>
          </span>
          <p className="bb-deliver">
            {p.plus ? "✦ FREE One-Day delivery" : `FREE delivery over ${money(FREE_SHIP_THRESHOLD)}`} — get it by{" "}
            <b>{deliveryDate(p.plus ? 1 : 3)}</b>
          </p>
          <p className="in-stock">
            {p.stock > 0 ? (p.stock <= 8 ? `Only ${p.stock} left in stock!` : "In stock") : "Out of stock"}
          </p>
          <div className="qty-row">
            <span>Qty:</span>
            <span className="qty-stepper">
              <button aria-label="Decrease" onClick={() => setQty((v) => clamp(v - 1))}>−</button>
              <output>{qty}</output>
              <button aria-label="Increase" onClick={() => setQty((v) => clamp(v + 1))}>+</button>
            </span>
          </div>
          <button className="btn btn-primary btn-block" disabled={p.stock === 0}
                  onClick={() => addToCart(p, qty, heroRef.current)}>
            Add to Cart
          </button>
          <button className="btn btn-secondary btn-block" disabled={p.stock === 0}
                  onClick={() => { addToCart(p, qty, null, { openDrawer: false }); navigate("/checkout"); }}>
            Buy Now
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => toggleWish(p.id)}>
            {wished ? "♥ In your Wish List" : "♡ Add to Wish List"}
          </button>
          <div className="bb-secure">
            <span>🔒 Secure transaction</span>
            <span>↩️ 7-day replacement</span>
            <span>🚚 NovaKart Delivered</span>
          </div>
        </aside>
      </div>

      <section className="section-card">
        <div className="section-head"><h2>Customers also viewed</h2></div>
        <div className="product-row">{related.map((x, i) => <ProductCard key={x.id} p={x} i={i} />)}</div>
      </section>
    </div>
  );
}
