import { NavLink, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import { Cart, Wishlist } from "../lib/db.js";
import { money, stars, discountPct, deliveryDate } from "../lib/utils.js";

/* ---------------- Toasts ---------------- */
export function Toasts() {
  const { toasts } = useShop();
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type} ${t.out ? "out" : ""}`}>
          {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "🔔"} <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Back to top
      </button>
      <div className="footer-cols">
        <div><h4>Get to Know Us</h4><a href="#!">About NovaKart</a><a href="#!">Careers</a><a href="#!">Press Releases</a></div>
        <div><h4>Connect with Us</h4><a href="#!">Facebook</a><a href="#!">Twitter</a><a href="#!">Instagram</a></div>
        <div><h4>Make Money with Us</h4><a href="#!">Sell on NovaKart</a><a href="#!">Become an Affiliate</a><a href="#!">Advertise</a></div>
        <div><h4>Let Us Help You</h4><NavLink to="/orders">Your Orders</NavLink><a href="#!">Returns Centre</a><a href="#!">Help</a></div>
      </div>
      <p className="footer-note">© 2026 NovaKart</p>
    </footer>
  );
}

/* ---------------- Bottom nav (mobile) ---------------- */
export function BottomNav() {
  const { version } = useShop();
  const count = Cart.count(); // re-read on version change
  void version;
  const cls = ({ isActive }) => (isActive ? "active" : "");
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={cls}><span>🏠</span>Home</NavLink>
      <NavLink to="/search" className={cls}><span>🧭</span>Browse</NavLink>
      <NavLink to="/cart" className={cls}>
        <span id="bnCartIcon">🛒</span>Cart
        {count > 0 && <i className="bn-badge">{count}</i>}
      </NavLink>
      <NavLink to="/orders" className={cls}><span>📦</span>Orders</NavLink>
      <NavLink to="/wishlist" className={cls}><span>♥</span>Wishlist</NavLink>
    </nav>
  );
}

/* ---------------- Product card ---------------- */
export function ProductCard({ p, i = 0 }) {
  const { addToCart, toggleWish, version } = useShop();
  const navigate = useNavigate();
  const wished = Wishlist.has(p.id);
  void version;

  const open = () => navigate(`/product/${p.id}`);
  const tag =
    p.tag === "deal" ? <span className="tag tag-deal">{discountPct(p)}% OFF · Deal</span> :
    p.tag === "best" ? <span className="tag tag-best">Bestseller</span> :
    p.tag === "new" ? <span className="tag tag-new">New launch</span> : null;

  return (
    <article className="product-card" style={{ animationDelay: `${Math.min(i * 45, 400)}ms` }}>
      <div className="p-tags">{tag}</div>
      <button
        className={`p-wish ${wished ? "active" : ""}`}
        aria-label="Toggle wishlist"
        onClick={() => toggleWish(p.id)}
      >♥</button>
      <div
        className="p-img"
        style={{ background: p.bg }}
        onClick={open}
        onKeyDown={(e) => e.key === "Enter" && open()}
        role="button"
        tabIndex={0}
      >{p.art}</div>
      <div className="p-body">
        <h3 className="p-name" onClick={open}>{p.name}</h3>
        <div className="p-rating">
          <span className="stars">{stars(p.rating)}</span>
          <small>{p.reviews.toLocaleString("en-IN")}</small>
        </div>
        <div className="p-price">
          <span className="now"><sup>₹</sup>{p.price.toLocaleString("en-IN")}</span>
          <span className="mrp">M.R.P: {money(p.mrp)}</span>
          <span className="off">({discountPct(p)}% off)</span>
        </div>
        {p.plus && <span className="p-plus">✦ nova+ · FREE One-Day Delivery</span>}
        <span className="p-deliver">Get it by <b>{deliveryDate(p.plus ? 1 : 3)}</b></span>
        <div className="p-cta">
          {p.stock === 0 ? (
            <span className="oos">Currently unavailable</span>
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => addToCart(p, 1, e.currentTarget.closest(".product-card").querySelector(".p-img"))}
              >Add to Cart</button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { addToCart(p, 1, null, { openDrawer: false }); navigate("/checkout"); }}
              >Buy Now</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
