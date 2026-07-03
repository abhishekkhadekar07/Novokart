import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS, FREE_SHIP_THRESHOLD, DELIVERY_FEE } from "../data/catalog.js";
import { Cart, Wishlist } from "../lib/db.js";
import { useShop } from "../context/ShopContext.jsx";
import { ProductCard } from "../components/shared.jsx";
import { money } from "../lib/utils.js";

export function CartPage() {
  const { version, bump, toast } = useShop();
  const navigate = useNavigate();
  void version;

  const items = Cart.detailed();

  if (!items.length) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="e-art">🛒</div>
          <h3>Your NovaKart cart is empty</h3>
          <p>Deals refresh every day — your cart is waiting to be filled.</p>
          <Link to="/" className="btn btn-primary">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const sub = Cart.subtotal();
  const savings = Cart.savings();
  const count = Cart.count();
  const freeShip = sub >= FREE_SHIP_THRESHOLD;
  const shipPct = Math.min(100, Math.round((sub / FREE_SHIP_THRESHOLD) * 100));
  const delivery = freeShip ? 0 : DELIVERY_FEE;

  const inc = (id) => {
    const line = Cart.items().find((i) => i.productId === id);
    const p = PRODUCTS.find((x) => x.id === id);
    Cart.setQty(id, Math.min(line.qty + 1, p.stock));
    bump();
  };
  const dec = (id) => {
    const line = Cart.items().find((i) => i.productId === id);
    Cart.setQty(id, line.qty - 1);
    bump();
  };
  const del = (id) => { Cart.remove(id); bump(); toast("Removed from cart"); };
  const saveLater = (id) => {
    Cart.remove(id);
    if (!Wishlist.has(id)) Wishlist.toggle(id);
    bump();
    toast("Saved to your Wish List ♥");
  };

  return (
    <div className="container">
      <div className="free-ship">
        {freeShip ? (
          <>🎉 <b>Your order qualifies for FREE delivery.</b></>
        ) : (
          <>Add <b>{money(FREE_SHIP_THRESHOLD - sub)}</b> more to get <b>FREE delivery</b></>
        )}
        <div className="fs-bar"><i style={{ width: `${shipPct}%` }} /></div>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          <h1>Shopping Cart</h1>
          <span className="deselect">{count} item{count > 1 ? "s" : ""} · Price</span>
          {items.map(({ product: p, qty }) => (
            <div className="cart-item" key={p.id}>
              <div className="ci-img" style={{ background: p.bg }} onClick={() => navigate(`/product/${p.id}`)}>
                {p.art}
              </div>
              <div className="ci-info">
                <h3 onClick={() => navigate(`/product/${p.id}`)}>{p.name}</h3>
                <p className="ci-stock">{p.stock > 0 ? "In stock" : "Out of stock"}</p>
                {p.plus && <span className="ci-plus">✦ nova+ eligible</span>}
                <div className="ci-actions">
                  <span className="qty-stepper">
                    <button aria-label="Decrease" onClick={() => dec(p.id)}>−</button>
                    <output>{qty}</output>
                    <button aria-label="Increase" onClick={() => inc(p.id)}>+</button>
                  </span>
                  <span className="divider">|</span>
                  <button className="link-btn" onClick={() => del(p.id)}>Delete</button>
                  <span className="divider">|</span>
                  <button className="link-btn" onClick={() => saveLater(p.id)}>Save for later</button>
                </div>
              </div>
              <div className="ci-price">
                {money(p.price * qty)}
                <br />
                <small style={{ fontWeight: 400, color: "var(--success)" }}>
                  You save {money((p.mrp - p.price) * qty)}
                </small>
              </div>
            </div>
          ))}
          <p className="cart-subtotal-line">
            Subtotal ({count} item{count > 1 ? "s" : ""}): <b>{money(sub)}</b>
          </p>
        </section>

        <aside className="summary-box">
          <h3>Order Summary</h3>
          <div className="sum-row"><span>Items ({count})</span><span>{money(sub)}</span></div>
          <div className="sum-row"><span>Delivery</span><span className={freeShip ? "free" : ""}>{freeShip ? "FREE" : money(delivery)}</span></div>
          <div className="sum-row"><span>Total savings</span><span className="free">−{money(savings)}</span></div>
          <div className="sum-row total"><span>Order Total</span><span>{money(sub + delivery)}</span></div>
          <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 12, textAlign: "center" }}>
            Proceed to Buy ({count})
          </Link>
          <Link to="/" className="btn btn-ghost btn-block" style={{ marginTop: 8, textAlign: "center" }}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function WishlistPage() {
  const { version } = useShop();
  void version;
  const items = PRODUCTS.filter((p) => Wishlist.ids().includes(p.id));

  return (
    <div className="container">
      <h1 className="page-title">
        ♥ Your Wish List <small style={{ fontWeight: 400, color: "var(--ink-soft)" }}>({items.length})</small>
      </h1>
      {items.length ? (
        <div className="product-grid">{items.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
      ) : (
        <div className="empty-state">
          <div className="e-art">💝</div>
          <h3>Your Wish List is empty</h3>
          <p>Tap the ♥ on any product to save it here for later.</p>
          <Link to="/" className="btn btn-primary">Discover products</Link>
        </div>
      )}
    </div>
  );
}
