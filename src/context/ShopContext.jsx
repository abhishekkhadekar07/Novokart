import { createContext, useContext, useState, useCallback, useRef } from "react";
import { Cart, Wishlist } from "../lib/db.js";
import { flyToCart } from "../lib/utils.js";

const ShopCtx = createContext(null);

export function ShopProvider({ children }) {
  /* version bump forces consumers to re-read Cart/Wishlist from localStorage */
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  const toast = useCallback((msg, type = "") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, out: true } : x))), 2600);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2950);
  }, []);

  /* mini cart drawer */
  const [drawer, setDrawer] = useState(null); // { product, qty } | null
  const closeDrawer = useCallback(() => setDrawer(null), []);

  /* cart badge pop */
  const [badgePop, setBadgePop] = useState(0);

  const addToCart = useCallback(
    (product, qty = 1, sourceEl = null, { openDrawer = true } = {}) => {
      if (!product) return;
      if (product.stock === 0) { toast("Sorry, this item is out of stock", "error"); return; }
      Cart.add(product.id, qty);
      bump();
      setBadgePop((n) => n + 1);
      if (sourceEl) flyToCart(sourceEl, product.art);
      if (openDrawer && window.innerWidth > 720) setDrawer({ product, qty });
      else toast(`Added to cart — ${product.name.slice(0, 34)}…`, "success");
    },
    [bump, toast]
  );

  const toggleWish = useCallback(
    (productId) => {
      const added = Wishlist.toggle(productId);
      bump();
      toast(added ? "Added to your Wish List ♥" : "Removed from Wish List");
      return added;
    },
    [bump, toast]
  );

  return (
    <ShopCtx.Provider
      value={{ version, bump, toasts, toast, drawer, closeDrawer, addToCart, toggleWish, badgePop }}
    >
      {children}
    </ShopCtx.Provider>
  );
}

export const useShop = () => useContext(ShopCtx);
