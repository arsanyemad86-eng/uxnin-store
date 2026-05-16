import React from "react";
import Icon from "./Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart, isWished, toggleWishlist, navigate, pushToast } = useApp();
  const wished = isWished(product.id);

  return (
    <article className="product-card">
      <div
        className="product-img-wrap"
        onClick={() => navigate("products/" + product.id)}
        style={{ cursor: "pointer" }}
      >
        {product.badge && (
          <span className={"product-tag" + (product.badge === "New" ? " new" : "")}>
            {product.badge}
          </span>
        )}
        <button
          className={"wishlist-btn" + (wished ? " active" : "")}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
            pushToast(wished ? "Removed from wishlist" : "Added to wishlist");
          }}
        >
          <Icon name="heart" size={17}/>
        </button>
        <img src={product.image} alt={product.name}/>
      </div>
      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <div
          className="product-name"
          onClick={() => navigate("products/" + product.id)}
        >{product.name}</div>
        <div className="product-rating">
          <span className="star"><Icon name="star" size={13}/></span>
          {product.rating} • {product.stock} in stock
        </div>
        <div className="product-price-row">
          <span className="product-price">LE {product.price.toLocaleString()}</span>
          {product.oldPrice > 0 && (
            <span className="product-old">LE {product.oldPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
      <div className="product-cta">
        <button className="add-btn" onClick={() => { addToCart(product); pushToast("Added to cart"); }}>
          <Icon name="plus" size={15}/> Add to cart
        </button>
      </div>
    </article>
  );
}
