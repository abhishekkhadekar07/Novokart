/* ============================================================
   NovaKart — db.js (localStorage "database" layer)
   Tables (keys):
     nk_users        → [{ id, name, email, passHash, salt, address, createdAt }]
     nk_session      → { userId, token, expiresAt }
     nk_cart_<uid>   → [{ productId, qty }]
     nk_wish_<uid>   → [productId]
     nk_orders_<uid> → [{ id, items, amounts, address, payment, placedAt }]
   ============================================================ */
import { PRODUCTS } from "../data/catalog.js";

const DB = {
  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("localStorage write failed", e);
    }
  },
  remove(key) { localStorage.removeItem(key); },
};

/* ---------- crypto helpers (SHA-256 via WebCrypto) ---------- */
async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomToken(len = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- Users & auth ---------- */
export const Auth = {
  USERS_KEY: "nk_users",
  SESSION_KEY: "nk_session",
  SESSION_DAYS: 7,

  users() { return DB.read(this.USERS_KEY, []); },

  findByEmail(email) {
    return this.users().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  async signup({ name, email, password }) {
    if (this.findByEmail(email)) throw new Error("An account already exists with this email. Try signing in.");
    const salt = randomToken(8);
    const user = {
      id: "u_" + randomToken(6),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      salt,
      passHash: await hashPassword(password, salt),
      address: null,
      createdAt: Date.now(),
    };
    DB.write(this.USERS_KEY, [...this.users(), user]);
    this.createSession(user.id);
    return user;
  },

  async login(email, password) {
    const user = this.findByEmail(email);
    if (!user) throw new Error("We couldn't find an account with that email.");
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passHash) throw new Error("Incorrect password. Please try again.");
    this.createSession(user.id);
    return user;
  },

  createSession(userId) {
    DB.write(this.SESSION_KEY, {
      userId,
      token: randomToken(),
      expiresAt: Date.now() + this.SESSION_DAYS * 24 * 60 * 60 * 1000,
    });
  },

  currentUser() {
    const s = DB.read(this.SESSION_KEY, null);
    if (!s || s.expiresAt < Date.now()) { DB.remove(this.SESSION_KEY); return null; }
    return this.users().find((u) => u.id === s.userId) || null;
  },

  updateUser(patch) {
    const me = this.currentUser();
    if (!me) return;
    DB.write(this.USERS_KEY, this.users().map((u) => (u.id === me.id ? { ...u, ...patch } : u)));
  },

  logout() { DB.remove(this.SESSION_KEY); },

  /* Seed a demo account (password: Demo@123) */
  async ensureDemo() {
    if (this.findByEmail("demo@novakart.in")) return;
    const salt = "demosalt";
    const users = this.users();
    users.push({
      id: "u_demo",
      name: "Demo Shopper",
      email: "demo@novakart.in",
      salt,
      passHash: await hashPassword("Demo@123", salt),
      address: {
        name: "Demo Shopper", phone: "9876543210",
        line1: "402, Sea Breeze Apartments", line2: "Linking Road, Bandra West",
        city: "Mumbai", state: "Maharashtra", pin: "400050",
      },
      createdAt: Date.now(),
    });
    DB.write(this.USERS_KEY, users);
  },
};

/* ---------- Per-user collections ---------- */
function uidKey(prefix) {
  const me = Auth.currentUser();
  return me ? `${prefix}_${me.id}` : null;
}

export const Cart = {
  items() { const k = uidKey("nk_cart"); return k ? DB.read(k, []) : []; },
  save(items) { const k = uidKey("nk_cart"); if (k) DB.write(k, items); },

  add(productId, qty = 1) {
    const items = this.items();
    const line = items.find((i) => i.productId === productId);
    const product = PRODUCTS.find((p) => p.id === productId);
    const max = product ? product.stock : 99;
    if (line) line.qty = Math.min(line.qty + qty, max);
    else items.push({ productId, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(productId, qty) {
    let items = this.items();
    if (qty <= 0) items = items.filter((i) => i.productId !== productId);
    else items = items.map((i) => (i.productId === productId ? { ...i, qty } : i));
    this.save(items);
  },
  remove(productId) { this.save(this.items().filter((i) => i.productId !== productId)); },
  clear() { this.save([]); },

  detailed() {
    return this.items()
      .map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.productId) }))
      .filter((i) => i.product);
  },
  count() { return this.items().reduce((n, i) => n + i.qty, 0); },
  subtotal() { return this.detailed().reduce((s, i) => s + i.product.price * i.qty, 0); },
  savings() { return this.detailed().reduce((s, i) => s + (i.product.mrp - i.product.price) * i.qty, 0); },
};

export const Wishlist = {
  ids() { const k = uidKey("nk_wish"); return k ? DB.read(k, []) : []; },
  has(id) { return this.ids().includes(id); },
  toggle(id) {
    const k = uidKey("nk_wish"); if (!k) return false;
    let ids = this.ids();
    const adding = !ids.includes(id);
    ids = adding ? [...ids, id] : ids.filter((x) => x !== id);
    DB.write(k, ids);
    return adding;
  },
  count() { return this.ids().length; },
};

export const Orders = {
  list() { const k = uidKey("nk_orders"); return k ? DB.read(k, []) : []; },
  place({ items, amounts, address, payment }) {
    const k = uidKey("nk_orders"); if (!k) return null;
    const order = {
      id: "NK-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000),
      items, amounts, address, payment,
      placedAt: Date.now(),
    };
    DB.write(k, [order, ...this.list()]);
    return order;
  },
  /* status derived from time since order → simulated fulfilment */
  status(order) {
    const mins = (Date.now() - order.placedAt) / 60000;
    if (mins < 1) return 0;      // Ordered
    if (mins < 3) return 1;      // Shipped
    if (mins < 6) return 2;      // Out for delivery
    return 3;                    // Delivered
  },
};
