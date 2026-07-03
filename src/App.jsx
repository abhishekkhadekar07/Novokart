import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import Header from "./components/Header.jsx";
import { MobileMenu, CartDrawer } from "./components/Drawers.jsx";
import { Toasts, Footer, BottomNav } from "./components/shared.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { CartPage, WishlistPage } from "./pages/CartPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

function Shell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  /* scroll to top + close overlays on navigation */
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <Header onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* key remounts main on navigation so the pageIn animation replays */}
      <main className="view" key={location.pathname + location.search}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:catId" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <CartDrawer />
      <BottomNav />
      <Footer />
    </div>
  );
}

/* Login gate — nothing renders until there's a valid session */
function Gate() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? <Shell /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Gate />
        <Toasts />
      </ShopProvider>
    </AuthProvider>
  );
}
