import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS, CATEGORIES } from "../data/products.js";
import { useApp } from "../context/AppContext.jsx";

const FEATURES = [
  "100% authentic — direct from authorized distributors",
  "Lab-tested for purity and potency",
  "Free delivery on orders over LE 300",
  "Easy 14-day returns",
];

export default function Products() {
  const { params, navigate, addToCart, toggleWishlist, isWished, pushToast } = useApp();
  const id = params[0];
  const product = PRODUCTS.find((p) => String(p.id) === String(id));
  const [qty, setQty] = useState(1);

  if (!id) {
    // No ID: behave as a "All products" listing
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
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p}/>)}
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
  const wished = isWished(product.id);

  return (
    <div style={{margin: "24px 0"}}>
      <div className="pd-grid">
        <div className="pd-img-wrap">
          <img src={product.image} alt={product.name}/>
        </div>
        <div className="pd-info">
          <div className="brand">{product.brand}</div>
          <h1>{product.name}</h1>
          <div className="product-rating" style={{fontSize: 14}}>
            <span className="star"><Icon name="star" size={14}/></span>
            {product.rating} • {product.stock} in stock
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
            <button className="btn btn-teal"
              onClick={() => { addToCart(product, qty); pushToast("Added to cart"); }}>
              <Icon name="cart" size={16}/> Add to cart
            </button>
            <button className="btn btn-ghost"
              onClick={() => { toggleWishlist(product); pushToast(wished ? "Removed from wishlist" : "Added to wishlist"); }}>
              <Icon name="heart" size={16}/> {wished ? "Wishlisted" : "Add to wishlist"}
            </button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div><h2>You may also like</h2></div>
        </div>
        <div className="product-grid">
          {PRODUCTS
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((p) => <ProductCard key={p.id} product={p}/>)}
        </div>
      </section>
    </div>
  );
}
