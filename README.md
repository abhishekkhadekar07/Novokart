# 🛒 NovaKart — Production-grade E-commerce Demo (React + Vite)

An Amazon-style shopping experience built with **React 18 + Vite + React Router v6**, using **localStorage as the database**, built and served via a **multi-stage Docker build** (node → nginx). Final image is ~12 MB.

> ⚡ Demo login: **demo@novakart.in** / **Demo@123** (or create your own account)

---

## 🚀 Run it

### Option 1 — Docker Compose (recommended)
```bash
docker compose up -d --build
# open http://localhost:3000
```

### Option 2 — Plain Docker
```bash
docker build -t novakart-react .
docker run -d -p 3000:80 --name novakart novakart-react
```

### Option 3 — Local dev (hot reload)
```bash
npm install
npm run dev
# open http://localhost:5173
```

> Note: use Rancher Desktop if Docker Desktop isn't permitted on your machine.

---

## 🏗️ Architecture

```
React 18 (functional components + hooks)
├── React Router v6 (BrowserRouter — nginx handles SPA fallback)
├── Context API for state
│   ├── AuthContext  → session, login/signup/logout, profile updates
│   └── ShopContext  → cart/wishlist mutations, toasts, mini-drawer, badge pop
└── lib/db.js        → framework-agnostic localStorage "database"
                       (Auth, Cart, Wishlist, Orders modules)
```

State pattern: mutations go through plain JS modules (`lib/db.js`) that write to
localStorage; `ShopContext` bumps a `version` counter so consuming components
re-read fresh data. Simple, debuggable, and swapping localStorage for a real API
later only touches `db.js`.

## 📦 Project structure

```
novakart-react/
├── index.html               # Vite entry
├── vite.config.js
├── package.json / package-lock.json
├── src/
│   ├── main.jsx             # ReactDOM root + BrowserRouter
│   ├── App.jsx              # Auth gate, layout shell, routes
│   ├── styles.css           # Design system, animations, responsive
│   ├── data/catalog.js      # Products, categories, hero banners
│   ├── lib/db.js            # localStorage DB (Auth/Cart/Wishlist/Orders)
│   ├── lib/utils.js         # money/stars/dates, fly-to-cart, confetti
│   ├── context/             # AuthContext, ShopContext
│   ├── components/          # Header, Drawers, shared (ProductCard, Toasts, BottomNav, Footer)
│   └── pages/               # AuthPage, Home, Search, ProductDetail, CartPage(+Wishlist), Checkout, OrdersPage
├── Dockerfile               # multi-stage: node:20-alpine build → nginx:alpine serve
├── nginx.conf               # gzip, cache, security headers, SPA fallback, /healthz
├── docker-compose.yml       # port 3000, restart policy, mem limit, log rotation
└── .dockerignore
```

## ✨ Features

- **Auth gate** — login/signup required to enter; SHA-256 + salt hashing (WebCrypto), 7-day sessions, password strength meter, demo account
- **Catalog** — 28 products, 8 categories, auto-rotating hero carousel, Deals/Bestsellers/New rows
- **Search** — live suggestions, category-scoped search, filters (category / price slider / rating / Nova+ / deals), 5 sort modes
- **Product page** — gallery thumbnails, buy box with qty stepper, stock urgency, specs, reviews, related products
- **Cart** — stock-capped steppers, delete, save-for-later → wishlist, free-delivery progress bar, mini cart drawer
- **Checkout** — 3 steps (Address → Payment → Review), validation (10-digit phone, 6-digit PIN, card auto-format, UPI regex), COD; address persists to profile
- **Orders** — history with a live status timeline that advances over minutes (Ordered → Shipped → Out for delivery → Delivered)
- **UX** — fly-to-cart animation, confetti on order success, toasts, badge pop, `prefers-reduced-motion` respected
- **Responsive** — hamburger drawer + bottom nav on mobile, bottom-sheet filters

## 🗄️ localStorage "database" schema

| Key | Contents |
|---|---|
| `nk_users` | `[{ id, name, email, passHash, salt, address, createdAt }]` |
| `nk_session` | `{ userId, token, expiresAt }` |
| `nk_cart_<uid>` | `[{ productId, qty }]` (per user) |
| `nk_wish_<uid>` | `[productId]` (per user) |
| `nk_orders_<uid>` | `[{ id, items, amounts, address, payment, placedAt }]` |

## 🏭 Production-grade touches

- **Multi-stage Dockerfile** — dependency layer cached separately from source (fast rebuilds); build tools never ship in the final image
- **nginx** — gzip, 7-day immutable caching for hashed assets, security headers, SPA fallback (`try_files → index.html`) so deep links like `/product/p06` work on refresh
- **`/healthz`** + Docker `HEALTHCHECK` + compose healthcheck
- `restart: unless-stopped`, memory limit, log rotation

## ⚠️ Honest limitations (by design)

localStorage lives in each visitor's browser — accounts, carts and orders are per-browser, not shared across devices, and clearing site data wipes them. Right trade-off for a demo/portfolio; the upgrade path is replacing `lib/db.js` with API calls to a real backend.


