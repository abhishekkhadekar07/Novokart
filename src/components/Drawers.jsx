import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { Cart } from "../lib/db.js";
import { CATEGORIES } from "../data/catalog.js";
import { money } from "../lib/utils.js";

/* ---------------- Mobile slide-in menu ---------------- */
export function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  const { toast } = useShop();
  const first = user?.name.split(" ")[0] || "there";

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={`mobile-menu ${open ? "open" : ""}`} aria-label="Menu" aria-hidden={!open}>
        <div className="mobile-menu-head">
          <div className="avatar">{first[0]?.toUpperCase()}</div>
          <strong>Hello, {first}</strong>
        </div>
        <nav onClick={onClose}>
          <h5>Shop</h5>
          <Link to="/">🏠 Home</Link>
          <Link to="/search?deal=1">🔥 Today's Deals</Link>
          <h5>Categories</h5>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/category/${c.id}`}>{c.art} {c.name}</Link>
          ))}
          <h5>You</h5>
          <Link to="/orders">📦 Your Orders</Link>
          <Link to="/wishlist">♥ Wish List</Link>
          <Link to="/cart">🛒 Cart</Link>
        </nav>
        <button className="menu-signout" onClick={() => { onClose(); logout(); toast("You've been signed out"); }}>
          ⇦ Sign Out
        </button>
      </aside>
    </>
  );
}

/* ---------------- Mini cart drawer (opens after add-to-cart) ---------------- */
export function CartDrawer() {
  const { drawer, closeDrawer, version } = useShop();
  const navigate = useNavigate();
  void version;

  const go = (path) => { closeDrawer(); navigate(path); };

  return (
    <>
      {drawer && <div className="drawer-overlay" onClick={closeDrawer} />}
      <aside className={`cart-drawer ${drawer ? "open" : ""}`} aria-label="Cart preview" aria-hidden={!drawer}>
        <div className="cart-drawer-head">
          <strong>Added to cart ✓</strong>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Close">✕</button>
        </div>
        {drawer && (
          <div id="cartDrawerBody">
            <div className="cd-item">
              <div className="cd-thumb" style={{ background: drawer.product.bg }}>{drawer.product.art}</div>
              <div className="cd-info">
                <strong>
                  {drawer.product.name.slice(0, 60)}
                  {drawer.product.name.length > 60 ? "…" : ""}
                </strong>
                <div className="p-price">
                  <span className="now">{money(drawer.product.price)}</span>
                  <span className="mrp">{money(drawer.product.mrp)}</span>
                </div>
                <small>Qty added: {drawer.qty}</small>
              </div>
            </div>
            <div className="cd-sub">
              <span>Cart subtotal ({Cart.count()} items)</span>
              <strong>{money(Cart.subtotal())}</strong>
            </div>
            <div className="cd-actions">
              <button className="btn btn-primary btn-block" onClick={() => go("/checkout")}>Proceed to checkout</button>
              <button className="btn btn-ghost btn-block" onClick={() => go("/cart")}>Go to cart</button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
