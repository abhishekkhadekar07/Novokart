/* Shared helpers — formatting + DOM animations */

export const money = (n) => "₹" + n.toLocaleString("en-IN");
export const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
export const discountPct = (p) => Math.round((1 - p.price / p.mrp) * 100);
export const deliveryDate = (days) =>
  new Date(Date.now() + days * 86400000).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Signature animation: product art flies into the cart icon */
export function flyToCart(fromEl, art) {
  if (reducedMotion() || !fromEl) return;
  const target =
    window.innerWidth <= 720
      ? document.getElementById("bnCartIcon")
      : document.getElementById("cartIconTarget");
  if (!target) return;
  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const fly = document.createElement("div");
  fly.className = "fly-item";
  fly.textContent = art;
  fly.style.left = a.left + a.width / 2 - 20 + "px";
  fly.style.top = a.top + a.height / 2 - 20 + "px";
  document.body.appendChild(fly);
  requestAnimationFrame(() => {
    fly.style.transform = `translate(${b.left - a.left - a.width / 2 + 20}px, ${
      b.top - a.top - a.height / 2 + 20
    }px) scale(0.2) rotate(20deg)`;
    fly.style.opacity = "0.2";
  });
  setTimeout(() => fly.remove(), 750);
}

export function confettiBurst() {
  if (reducedMotion()) return;
  const glyphs = ["🎉", "✨", "🎊", "⭐", "🧡"];
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = glyphs[i % glyphs.length];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3800);
  }
}
