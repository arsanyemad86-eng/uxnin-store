import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function ProductCard({ product, variants }) {
  const { addToCart, isWished, toggleWishlist, navigate, pushToast } = useApp();
  const wished = isWished(product._id);

  const discount = product.oldPrice > 0
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const [adding, setAdding] = useState(false);
  const addTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(addTimeoutRef.current), []);

  const handleAddToCart = () => {
    addToCart(product);
    pushToast("Added to cart ✓", "cart");
    setAdding(true);
    clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = setTimeout(() => setAdding(false), 2000);
  };

  const [heartPop, setHeartPop] = useState(false);
  const wasWished = useRef(wished);
  useEffect(() => {
    if (wished && !wasWished.current) {
      setHeartPop(true);
      const t = setTimeout(() => setHeartPop(false), 450);
      wasWished.current = wished;
      return () => clearTimeout(t);
    }
    wasWished.current = wished;
  }, [wished]);

  return (
    <motion.article
      className="product-card"
      variants={variants}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div
        className="product-img-wrap"
        onClick={() => navigate("products/" + product._id)}
        style={{ cursor: "pointer" }}
      >
        {product.badge && (
          <span className={"product-tag" + (product.badge === "New" ? " new" : "")}>
            {product.badge}
          </span>
        )}

        {discount > 0 && (
          <span style={{
            position: "absolute", bottom: 10, left: 10,
            background: "rgba(255,94,91,0.12)",
            color: "var(--coral)",
            fontSize: "11px", fontWeight: 700,
            padding: "3px 8px", borderRadius: 6,
            border: "1px solid rgba(255,94,91,0.2)",
          }}>
            -{discount}%
          </span>
        )}

        <button
          className={"wishlist-btn" + (wished ? " active" : "") + (heartPop ? " pop" : "")}
          onClick={(e) => {
            e.stopPropagation();
            const nowWished = isWished(product._id);
            toggleWishlist(product);
            pushToast(nowWished ? "Removed from wishlist" : "Added to wishlist ♥", nowWished ? "removed" : "wishlist");
          }}
        >
          <span className="wishlist-circle" />
          <Icon name="heart" size={17}/>
        </button>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ opacity: 0, transition: "opacity 300ms ease" }}
          onLoad={(e) => e.target.style.opacity = 1}
        />
      </div>

      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <div
          className="product-name"
          onClick={() => navigate("products/" + product._id)}
        >{product.name}</div>

        {product.countInStock <= 10 && (
          <div style={{
            fontSize: 11.5, fontWeight: 700,
            color: "var(--coral)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            ⚠ Only {product.countInStock} left!
          </div>
        )}
        <div className="product-rating">
          <span className="star"><Icon name="star" size={13}/></span>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>{product.rating}</span>
          <span style={{ color: "var(--text-muted)" }}>• {product.countInStock} in stock</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">LE {product.price.toLocaleString()}</span>
          {product.oldPrice > 0 && (
            <span className="product-old">LE {product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="product-cta">
        <button
          className={"add-btn" + (adding ? " adding" : "")}
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
      </div>
    </motion.article>
  );
}