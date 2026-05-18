import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Cart() {
  const { cart, updateQty, removeFromCart, navigate, placeOrder, pushToast } = useApp();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 0 && subtotal < 300 ? 50 : 0;
  const total = subtotal - discount + shipping;

  const checkout = () => {
    if (cart.length === 0) return;
    placeOrder(total);
    pushToast("Order placed! Check dashboard.");
    setTimeout(() => navigate("dashboard"), 600);
  };

  return (
    <div>
      <div className="section-head" style={{margin: "24px 0 18px"}}>
        <div>
          <h2>Your cart</h2>
          <div className="sub">{cart.reduce((s, i) => s + i.qty, 0)} items</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("shop")}>
          ← Continue shopping
        </button>
      </div>
      {cart.length === 0 ? (
        <div className="cart-list" style={{textAlign: "center", padding: "80px 20px"}}>
          <Icon name="cart" size={48}/>
          <div style={{fontSize: 18, fontWeight: 700, marginTop: 12}}>Your cart is empty</div>
          <div style={{color: "var(--text-muted)", marginTop: 6, marginBottom: 18}}>
            Browse the shop and start filling it.
          </div>
          <button className="btn btn-teal" onClick={() => navigate("shop")}>Go to shop</button>
        </div>
      ) : (
        <div className="cart-page">
          <div className="cart-list">
            {cart.map((i) => (
              <div key={i.id} className="cart-row">
                <img src={i.image} alt=""/>
                <div>
                  <div className="name">{i.name}</div>
                  <div className="meta">{i.brand} · LE {i.price.toLocaleString()}</div>
                </div>
                <div className="qty-row">
                  <button className="qty-btn" onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                  <span className="qty-val">{i.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                </div>
                <div style={{fontWeight: 700}}>LE {(i.price * i.qty).toLocaleString()}</div>
                <button className="remove-btn" onClick={() => removeFromCart(i.id)}>
                  <Icon name="x" size={18}/>
                </button>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h3 style={{fontSize: 17, fontWeight: 700}}>Order summary</h3>
            <div className="promo-row">
              <input
                placeholder="Promo code (FIT10)"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button className="btn btn-ghost" style={{padding: "9px 14px"}}
                onClick={() => setPromoApplied(promo.trim().toUpperCase() === "FIT10")}>
                Apply
              </button>
            </div>
            {promoApplied && (
              <div style={{fontSize: 12.5, color: "var(--teal)", fontWeight: 600}}>
                ✓ FIT10 applied — 10% off
              </div>
            )}
            <div className="summary">
              <div className="sum-row"><span>Subtotal</span><span>LE {subtotal.toLocaleString()}</span></div>
              {discount > 0 && (
                <div className="sum-row discount"><span>Discount</span><span>− LE {discount.toLocaleString()}</span></div>
              )}
              <div className="sum-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : "LE " + shipping}</span></div>
              <div className="sum-row total"><span>Total</span><span>LE {total.toLocaleString()}</span></div>
            </div>
            <button className="btn btn-teal btn-block" onClick={checkout}>Checkout →</button>
            <div style={{fontSize: 12, color: "var(--text-muted)", textAlign: "center"}}>
              Free delivery on orders over LE 300
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
