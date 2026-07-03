import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data/catalog.js";
import { ProductCard } from "../components/shared.jsx";
import { money, stars, discountPct } from "../lib/utils.js";

const DEFAULTS = { cat: "all", maxPrice: 60000, minRating: 0, plusOnly: false, dealOnly: false, tag: "", sort: "featured" };

export default function Search() {
  const { catId } = useParams();
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const [f, setF] = useState({ ...DEFAULTS });
  const [panelOpen, setPanelOpen] = useState(false);

  /* re-init filters whenever the route/query changes */
  useEffect(() => {
    setF({
      ...DEFAULTS,
      cat: catId || params.get("cat") || "all",
      dealOnly: params.get("deal") === "1",
      tag: params.get("tag") || "",
    });
    setPanelOpen(false);
  }, [catId, params]);

  const patch = (p) => setF((prev) => ({ ...prev, ...p }));

  const list = useMemo(() => {
    let out = PRODUCTS.filter(
      (p) =>
        (f.cat === "all" || p.cat === f.cat) &&
        p.price <= f.maxPrice &&
        p.rating >= f.minRating &&
        (!f.plusOnly || p.plus) &&
        (!f.dealOnly || p.tag === "deal") &&
        (!f.tag || p.tag === f.tag)
    );
    if (q) {
      const needle = q.toLowerCase();
      out = out.filter(
        (p) => p.name.toLowerCase().includes(needle) || p.brand.toLowerCase().includes(needle) || p.cat.includes(needle)
      );
    }
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => discountPct(b) - discountPct(a),
    };
    if (sorters[f.sort]) out = [...out].sort(sorters[f.sort]);
    return out;
  }, [f, q]);

  const crumb = f.dealOnly
    ? "Today's Deals"
    : f.cat !== "all"
    ? CATEGORIES.find((c) => c.id === f.cat)?.name || "Results"
    : q
    ? `"${q}"`
    : "All products";

  return (
    <div className="container">
      <div className="breadcrumb"><Link to="/">Home</Link> › <b>{crumb}</b></div>
      <div className="search-layout">
        <aside className={`filters ${panelOpen ? "open" : ""}`} aria-label="Filters">
          <h4>Category</h4>
          <label>
            <input type="radio" name="fcat" checked={f.cat === "all"} onChange={() => patch({ cat: "all" })} /> All
          </label>
          {CATEGORIES.map((c) => (
            <label key={c.id}>
              <input type="radio" name="fcat" checked={f.cat === c.id} onChange={() => patch({ cat: c.id })} /> {c.name}
            </label>
          ))}

          <h4>Max price: <span className="price-out">{money(f.maxPrice)}</span></h4>
          <input
            type="range" min="500" max="60000" step="500"
            value={f.maxPrice}
            onChange={(e) => patch({ maxPrice: +e.target.value })}
          />

          <h4>Customer rating</h4>
          {[4, 3, 2].map((r) => (
            <label key={r}>
              <input type="radio" name="frate" checked={f.minRating === r} onChange={() => patch({ minRating: r })} />{" "}
              <span className="stars">{stars(r)}</span> & up
            </label>
          ))}
          <label>
            <input type="radio" name="frate" checked={f.minRating === 0} onChange={() => patch({ minRating: 0 })} /> Any rating
          </label>

          <h4>More</h4>
          <label><input type="checkbox" checked={f.plusOnly} onChange={(e) => patch({ plusOnly: e.target.checked })} /> ✦ nova+ eligible only</label>
          <label><input type="checkbox" checked={f.dealOnly} onChange={(e) => patch({ dealOnly: e.target.checked })} /> 🔥 Deals only</label>

          <button className="btn btn-ghost btn-sm filter-clear" onClick={() => { setF({ ...DEFAULTS }); setPanelOpen(false); }}>
            Clear all filters
          </button>
        </aside>

        <section>
          <div className="results-bar">
            <button className="btn btn-ghost btn-sm filters-toggle" onClick={() => setPanelOpen((o) => !o)}>⚙ Filters</button>
            <p>{list.length} result{list.length === 1 ? "" : "s"}{q ? ` for "${q}"` : ""}</p>
            <select value={f.sort} onChange={(e) => patch({ sort: e.target.value })} aria-label="Sort results">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Avg. customer rating</option>
              <option value="discount">Discount %</option>
            </select>
          </div>

          <div className="product-grid">
            {list.length > 0 ? (
              list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)
            ) : (
              <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                <div className="e-art">🔍</div>
                <h3>No results found</h3>
                <p>Try different keywords or remove some filters.</p>
                <button className="btn btn-primary" onClick={() => setF({ ...DEFAULTS })}>Clear filters</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
