import React, { useMemo } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products.js";

export default function SearchDropdown({ term, filter, setFilter, onPick }) {
  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const okCat = filter === "all" || p.category === filter;
      const okText = !t || p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t);
      return okCat && okText;
    }).slice(0, 8);
  }, [term, filter]);

  return (
    <div className="search-dropdown" onMouseDown={(e) => e.stopPropagation()}>
      <div className="search-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={"filter-chip" + (filter === c.key ? " active" : "")}
            onClick={() => setFilter(c.key)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="search-results">
        {filtered.length === 0 && (
          <div className="search-empty">No products match — try a different keyword.</div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="search-result" onClick={() => onPick(p)}>
            <img src={p.image} alt={p.name}/>
            <div style={{flex: 1}}>
              <div className="name">{p.name}</div>
              <div className="meta">{p.brand} • LE {p.price.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
