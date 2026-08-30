import React, { useState, useMemo, useEffect, useRef } from "react";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { CATEGORIES } from "../data/products.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

export default function Shop() {
  const {
    cart, updateQty, removeFromCart, navigate,
    promo, setPromo, promoApplied, discountPercent, isApplyingPromo, applyPromo,
  } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const cartRef = useRef(null);
  const [sort, setSort] = useState("featured");
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => setCat(e.detail);
    window.addEventListener("uxnin:cat", handler);
    return () => window.removeEventListener("uxnin:cat", handler);
  }, []);

  const list = useMemo(() => {
    let arr = products.slice();
    if (cat !== "all") arr = arr.filter((p) => p.category === cat);
    if (q.trim()) {
      const t = q.toLowerCase();
      arr = arr.filter((p) =>
        p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t)
      );
    }
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    else if (sort === "high") arr.sort((a, b) => b.price - a.price);
    else if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [cat, q, sort, products]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const shipping = subtotal > 0 && subtotal - discount < 300 ? 50 : 0;
  const total = subtotal - discount + shipping;

  return (
    <div>
      <div className="section-head" style={{margin: "24px 0 18px"}}>
        <div>
          <h2>Shop all supplements</h2>
          <div className="sub">{list.length} product{list.length !== 1 ? "s" : ""} found</div>
        </div>
      </div>
      <div className="shop-grid">
        <div>
          <div className="shop-toolbar">
            <div className="shop-search">
              <Icon name="search" size={16}/>
              <input
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="filter-chip"
              style={{padding: "8px 14px"}}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low → high</option>
              <option value="high">Price: high → low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          <div className="cat-pills" style={{marginBottom: 18}}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={"pill" + (cat === c.key ? " active" : "")}
                onClick={() => setCat(c.key)}
              >{c.name}</button>
            ))}
          </div>
          <div className="shop-product-grid">
            {loading ? (
              <div className="cart-empty" style={{gridColumn: "1/-1"}}>Loading products...</div>
            ) : (
              <>
                {list.map((p) => <ProductCard key={p._id} product={p}/>)}
                {list.length === 0 && (
                  <div className="cart-empty" style={{gridColumn: "1/-1"}}>
                    No products match your search.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <aside className="cart-panel" ref={cartRef}>
          <h3>Your cart ({cart.reduce((s, i) => s + i.qty, 0)})</h3>
          <div className="cart-items">
            {cart.length === 0 && (
              <div className="cart-empty">
                Your cart is empty.<br/>Add products to get started.
              </div>
            )}
            {cart.map((i) => (
              <div key={i._id} className="cart-item">
                <img src={i.image} alt=""/>
                <div>
                  <div className="cart-item-name">{i.name}</div>
                  <div className="cart-item-price">LE {i.price.toLocaleString()}</div>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => updateQty(i._id, i.qty - 1)}>−</button>
                    <span className="qty-val">{i.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(i._id, i.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(i._id)}>
                  <Icon name="x" size={16}/>
                </button>
              </div>
            ))}
          </div>
          <div className="promo-row">
            <input
              placeholder="Promo code (FIT10)"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              disabled={isApplyingPromo}
            />
            <button
              className="btn btn-ghost"
              style={{padding: "9px 14px"}}
              onClick={() => applyPromo(subtotal)}
              disabled={isApplyingPromo}
            >
              {isApplyingPromo ? "Applying..." : "Apply"}
            </button>
          </div>
          {promoApplied && (
            <div style={{fontSize: 12.5, color: "var(--teal)", fontWeight: 600}}>
              ✓ {discountPercent}% off applied
            </div>
          )}
          <div className="summary">
            <div className="sum-row"><span>Subtotal</span><span>LE {subtotal.toLocaleString()}</span></div>
            {discount > 0 && (
              <div className="sum-row discount"><span>Discount</span><span>− LE {discount.toLocaleString()}</span></div>
            )}
            <div className="sum-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? (subtotal > 0 ? "Free" : "—") : "LE " + shipping}</span>
            </div>
            <div className="sum-row total"><span>Total</span><span>LE {total.toLocaleString()}</span></div>
          </div>
          <button
            className="btn btn-teal btn-block"
            disabled={cart.length === 0}
            onClick={() => navigate("cart")}
          >
            Checkout →
          </button>
        </aside>
      </div>
      <button
        className="scroll-btn scroll-top-btn"
        onClick={() => scrollPos > 300
          ? window.scrollTo({ top: 0, behavior: "smooth" })
          : cartRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {scrollPos > 300 ? "↑" : "↓"}
      </button>
    </div>
  );
}