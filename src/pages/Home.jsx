import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, HERO_SLIDES, PRODUCTS } from "../data/catalog.js";
import { ProductCard } from "../components/shared.jsx";

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const navigate = useNavigate();

  const restart = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 4500);
  };

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
  }, []);

  const go = (i) => {
    setIndex((i + HERO_SLIDES.length) % HERO_SLIDES.length);
    restart();
  };

  return (
    <section className="hero" aria-label="Offers">
      <div className="hero-slides" style={{ transform: `translateX(-${index * 100}%)` }}>
        {HERO_SLIDES.map((s) => (
          <div key={s.h} className="hero-slide" style={{ background: s.bg }}>
            <div className="h-copy">
              <h2>{s.h}</h2>
              <p>{s.p}</p>
              <button className="btn btn-secondary" onClick={() => navigate(s.link.replace("#", ""))}>
                {s.cta}
              </button>
            </div>
            <div className="h-art">{s.art}</div>
          </div>
        ))}
      </div>
      <button className="hero-arrow prev" aria-label="Previous" onClick={() => go(index - 1)}>‹</button>
      <button className="hero-arrow next" aria-label="Next" onClick={() => go(index + 1)}>›</button>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={i === index ? "active" : ""} aria-label={`Slide ${i + 1}`} onClick={() => go(i)} />
        ))}
      </div>
      <div className="hero-fade" />
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const deals = PRODUCTS.filter((p) => p.tag === "deal");
  const best = PRODUCTS.filter((p) => p.tag === "best");
  const fresh = PRODUCTS.filter((p) => p.tag === "new");

  return (
    <>
      <HeroCarousel />
      <div className="container">
        <div className="cat-grid">
          {CATEGORIES.slice(0, 4).map((c) => (
            <button key={c.id} className="cat-card" onClick={() => navigate(`/category/${c.id}`)}>
              <h3>{c.name}</h3>
              <div className="cat-art" style={{ background: c.bg }}>{c.art}</div>
              <span>Shop now ›</span>
            </button>
          ))}
        </div>

        <section className="section-card">
          <div className="section-head"><h2>🔥 Today's Deals</h2><Link to="/search?deal=1">See all deals</Link></div>
          <div className="product-row">{deals.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        </section>

        <section className="section-card">
          <div className="section-head"><h2>⭐ Bestsellers</h2><Link to="/search">Explore</Link></div>
          <div className="product-row">{best.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        </section>

        <section className="section-card">
          <div className="section-head"><h2>🚀 New launches</h2><Link to="/search?tag=new">See what's new</Link></div>
          <div className="product-row">{fresh.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        </section>

        <section className="section-card">
          <div className="section-head"><h2>Recommended for you</h2></div>
          <div className="product-grid">{PRODUCTS.slice(0, 12).map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}</div>
        </section>
      </div>
    </>
  );
}
