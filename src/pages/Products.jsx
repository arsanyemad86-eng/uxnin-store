import React, { useState, useRef, useEffect, useMemo } from "react";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORIES, HERO_IMAGE } from "../data/products.jsx";
import api from "../api/axios.js";
import { useApp } from "../context/AppContext.jsx";

const FEATURES = [
  "100% authentic — direct from authorized distributors",
  "Lab-tested for purity and potency",
  "Free delivery on orders over LE 300",
  "Easy 14-day returns",
];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img skeleton-pulse"/>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton-line skeleton-pulse" style={{ width: "40%", height: 10 }}/>
        <div className="skeleton-line skeleton-pulse" style={{ width: "90%", height: 13 }}/>
        <div className="skeleton-line skeleton-pulse" style={{ width: "70%", height: 13 }}/>
        <div className="skeleton-line skeleton-pulse" style={{ width: "50%", height: 16, marginTop: 4 }}/>
      </div>
      <div style={{ padding: "0 14px 14px" }}>
        <div className="skeleton-line skeleton-pulse" style={{ width: "100%", height: 36, borderRadius: 10 }}/>
      </div>
    </div>
  );
}

export default function Products() {
  const { params, navigate, addToCart, toggleWishlist, isWished, pushToast, addRecentlyViewed } = useApp();
  const [skelLoading, setSkelLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        pushToast("تعذر تحميل المنتجات", "error");
      } finally {
        setSkelLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const id = params[0];
  const product = products.find((p) => String(p._id) === String(id));
  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  /* ── Add to cart button animation ── */
  const [adding, setAdding] = useState(false);
  const addTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(addTimeoutRef.current), []);

  useEffect(() => {
    if (product) addRecentlyViewed(product._id);
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomOpen]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    pushToast("Added to cart ✓", "cart");
    setAdding(true);
    clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = setTimeout(() => setAdding(false), 2000);
  };

  if (!id) {
    return (
      <div>
        <div className="section-head" style={{margin: "24px 0 18px"}}>
          <div>
            <h2>All products</h2>
            <div className="sub">Browse the full UXNIN catalog.</div>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate("shop")}>Open shop view</button>
        </div>
        <div className="product-grid">
          {skelLoading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i}/>)
            : products.map((p) => <ProductCard key={p._id} product={p}/>)
          }
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="cart-list" style={{textAlign: "center", padding: "80px 20px", marginTop: 24}}>
        <div style={{fontSize: 18, fontWeight: 700}}>Product not found</div>
        <button className="btn btn-teal" style={{marginTop: 14}} onClick={() => navigate("shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  const catName = CATEGORIES.find((c) => c.key === product.category)?.name.toLowerCase();
  const wished = isWished(product._id);

  return (
    <div style={{margin: "24px 0"}}>
      <div className="pd-grid">
        <div className="pd-img-wrap" onClick={() => setZoomOpen(true)} style={{cursor: "zoom-in"}}>
          <img src={product.image} alt={product.name}/>
        </div>
        <div className="pd-info">
          <div className="brand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="product-rating" style={{fontSize: 14}}>
            <span className="star"><Icon name="star" size={14}/></span>
            {product.rating} • {product.countInStock} in stock
          </div>
          <div className="pd-price">
            LE {product.price.toLocaleString()}
            {product.oldPrice > 0 && (
              <span style={{fontSize: 18, color: "var(--text-muted)", textDecoration: "line-through", fontWeight: 500, marginLeft: 10}}>
                LE {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p style={{color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.6}}>
            Premium-grade {catName} from {product.brand}. Lab-verified, third-party tested,
            with full traceability from sourcing to packaging. Designed for serious lifters
            who train hard and recover smart.
          </p>
          <ul className="pd-feature-list">
            {FEATURES.map((f, i) => (
              <li key={i}><span className="check">✓</span>{f}</li>
            ))}
          </ul>
          <div className="qty-row" style={{marginTop: 14}}>
            <span style={{color: "var(--text-muted)", fontSize: 13, marginRight: 8}}>Quantity</span>
            <button className="qty-btn" style={{width: 32, height: 32, fontSize: 16}}
              onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span className="qty-val" style={{minWidth: 30, fontSize: 15}}>{qty}</span>
            <button className="qty-btn" style={{width: 32, height: 32, fontSize: 16}}
              onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <div className="pd-actions">
            <button
              className={"btn btn-teal add-btn" + (adding ? " adding" : "")}
              style={{ width: "auto" }}
              onClick={handleAddToCart}
            >
              <span className="add-btn-icon">
                <span className="icon-plus"><Icon name="plus" size={15}/></span>
                <span className="icon-cart"><Icon name="cart" size={15}/></span>
                <span className="icon-box" />
              </span>
              <span className="add-btn-text" key={adding ? "added" : "add"}>
                {adding ? "Added" : "Add to cart"}
              </span>
            </button>
            <button className="btn btn-ghost"
              onClick={() => { toggleWishlist(product); pushToast(wished ? "Removed from wishlist" : "Added to wishlist ♥", wished ? "removed" : "wishlist"); }}
              style={{ color: wished ? "var(--coral)" : "var(--text)" }}
            >
              <Icon name="heart" size={16} style={{ fill: wished ? "var(--coral)" : "transparent", color: wished ? "var(--coral)" : "var(--text)" }}/> 
              {wished ? "Wishlisted" : "Add to wishlist"}
            </button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div><h2>You may also like</h2></div>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.category === product.category && p._id !== product._id)
            .slice(0, 4)
            .map((p) => <ProductCard key={p._id} product={p}/>)}
        </div>
      </section>

      {zoomOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
          onClick={() => setZoomOpen(false)}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}