import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { Cart, Wishlist } from "../lib/db.js";
import { CATEGORIES, PRODUCTS } from "../data/catalog.js";
import { money } from "../lib/utils.js";

export default function Header({ onMenu }) {
  const { user, logout } = useAuth();
  const { version, badgePop, toast } = useShop();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [suggest, setSuggest] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);
  const accountRef = useRef(null);
  const badgeRef = useRef(null);

  void version; // re-read counts when cart/wishlist change
  const cartCount = Cart.count();
  const wishCount = Wishlist.count();
  const first = user?.name.split(" ")[0] || "friend";

  /* badge pop animation on add-to-cart */
  useEffect(() => {
    const b = badgeRef.current;
    if (!b || !badgePop) return;
    b.classList.remove("pop");
    void b.offsetWidth;
    b.classList.add("pop");
  }, [badgePop]);

  /* click-outside closes menus */
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setMenuOpen(false);
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSuggest([]);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const goSearch = () => {
    setSuggest([]);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat !== "all") params.set("cat", cat);
    navigate(`/search?${params}`);
  };

  const onInput = (value) => {
    setQ(value);
    const needle = value.trim().toLowerCase();
    if (needle.length < 2) { setSuggest([]); return; }
    setSuggest(
      PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.brand.toLowerCase().includes(needle) ||
          p.cat.includes(needle)
      ).slice(0, 6)
    );
  };

  return (
    <header className="site-header">
      <div className="header-main">
        <button className="icon-btn burger" aria-label="Open menu" onClick={onMenu}>☰</button>
        <Link to="/" className="logo" aria-label="NovaKart home">
          nova<span>kart</span><em>.in</em>
        </Link>

        <button className="deliver-to" onClick={() => toast("Delivery address can be changed at checkout")}>
          <span className="pin">📍</span>
          <span className="deliver-text">
            <small>Deliver to</small>
            <strong>{user?.address ? `${user.address.city} ${user.address.pin}` : "Mumbai 400001"}</strong>
          </span>
        </button>

        <div className="search-wrap" ref={wrapRef}>
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Search in category">
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search NovaKart"
            value={q}
            autoComplete="off"
            aria-label="Search products"
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goSearch()}
          />
          <button onClick={goSearch} aria-label="Search">🔍</button>
          {suggest.length > 0 && (
            <div className="search-suggest">
              {suggest.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSuggest([]); setQ(""); navigate(`/product/${p.id}`); }}
                >
                  <span className="s-thumb">{p.art}</span>
                  {p.name.slice(0, 52)}…<small>{money(p.price)}</small>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="header-actions">
          <div className="account-wrap" ref={accountRef}>
            <button className="header-link" onClick={() => setMenuOpen((o) => !o)}>
              <small>Hello, {first}</small>
              <strong>Account & Lists ▾</strong>
            </button>
            {menuOpen && (
              <div className="account-menu">
                <div className="account-menu-head">
                  <div className="avatar">{first[0]?.toUpperCase()}</div>
                  <div><strong>{user?.name}</strong><small>{user?.email}</small></div>
                </div>
                <NavLink to="/orders" onClick={() => setMenuOpen(false)}>📦 Your Orders</NavLink>
                <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>♥ Your Wish List</NavLink>
                <NavLink to="/cart" onClick={() => setMenuOpen(false)}>🛒 Your Cart</NavLink>
                <button onClick={() => { logout(); toast("You've been signed out"); }}>⇦ Sign Out</button>
              </div>
            )}
          </div>
          <NavLink to="/orders" className="header-link"><small>Returns</small><strong>& Orders</strong></NavLink>
          <NavLink to="/wishlist" className="icon-btn wish-btn" aria-label="Wishlist">
            ♥{wishCount > 0 && <span className="badge">{wishCount}</span>}
          </NavLink>
          <NavLink to="/cart" className="cart-btn" aria-label="Cart">
            <span className="cart-icon" id="cartIconTarget">🛒</span>
            <span className="badge" ref={badgeRef}>{cartCount}</span>
            <strong>Cart</strong>
          </NavLink>
        </nav>
      </div>

      <div className="header-sub">
        <div className="cat-strip">
          <NavLink to="/search?deal=1">🔥 Today's Deals</NavLink>
          {CATEGORIES.map((c) => (
            <NavLink key={c.id} to={`/category/${c.id}`}>{c.name}</NavLink>
          ))}
        </div>
        <span className="sub-promo">✨ Nova+ members get FREE one-day delivery</span>
      </div>
    </header>
  );
}
