import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

const STEPS = ["Cart", "Details", "Confirm"];

function StepBar({ step }) {
  return (
    <div className="checkout-steps">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={"checkout-step" + (i <= step ? " active" : "") + (i < step ? " done" : "")}>
            <div className="step-circle">
              {i < step ? <Icon name="check" size={13}/> : i + 1}
            </div>
            <span>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={"step-line" + (i < step ? " active" : "")}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OrderSummary({ cart, discount, shipping, total, promoApplied, promoCode }) {
  return (
    <aside className="checkout-summary">
      <h3>Order summary</h3>
      <div className="checkout-items">
        {cart.map((i) => (
          <div key={i._id} className="checkout-item">
            <div className="checkout-item-img">
              <img src={i.image} alt={i.name}/>
              <span className="checkout-item-qty">{i.qty}</span>
            </div>
            <div className="checkout-item-info">
              <div className="checkout-item-name">{i.name}</div>
              <div className="checkout-item-brand">{i.brand}</div>
            </div>
            <div className="checkout-item-price">LE {(i.price * i.qty).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="summary">
        <div className="sum-row">
          <span>Subtotal</span>
          <span>LE {cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="sum-row discount">
            <span>{promoCode ? promoCode.toUpperCase() : "Discount"}</span>
            <span>− LE {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="sum-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : "LE " + shipping}</span>
        </div>
        <div className="sum-row total">
          <span>Total</span>
          <span>LE {total.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}

export default function Checkout() {
  const {
    cart, user, clearCart, pushToast, navigate,
    promo, setPromo, promoApplied, discountPercent, isApplyingPromo, applyPromo,
  } = useApp();

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName:  user?.name?.split(" ")[1] || "",
    email:     user?.email || "",
    phone:     "",
    address:   "",
    city:      "",
    payment:   "cod",
  });
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promoApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const shipping = subtotal > 0 && subtotal - discount < 300 ? 50 : 0;
  const total    = subtotal - discount + shipping;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validateDetails = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required.";
    if (!form.lastName.trim())  e.lastName  = "Required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Valid email required.";
    if (!form.phone.trim())     e.phone   = "Required.";
    if (!form.address.trim())   e.address = "Required.";
    if (!form.city.trim())      e.city    = "Required.";
    return e;
  };

  const handleNext = () => {
    if (step === 0) { setStep(1); return; }
    if (step === 1) {
      const e = validateDetails();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
      setStep(2);
    }
  };

  const handlePlace = async () => {
    if (isPlacing) return;
    setIsPlacing(true);
    const orderItems = cart.map((i) => ({
      product: i._id,
      name: i.name,
      image: i.image,
      price: i.price,
      qty: i.qty,
    }));

    const shippingInfo = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
    };

    try {
      const { data } = await api.post("/orders", {
    orderItems,
    shippingInfo,
    paymentMethod: form.payment,
    promoCode: promoApplied ? promo : "",
  });

      clearCart();
      pushToast("Order " + data._id + " placed!");
      navigate("dashboard");
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  if (cart.length === 0 && step < 2) {
    return (
      <div className="cart-list" style={{ textAlign: "center", padding: "80px 20px", marginTop: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Your cart is empty</div>
        <button className="btn btn-teal" style={{ marginTop: 14 }} onClick={() => navigate("shop")}>
          Go to shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ margin: "24px 0" }}>
      <div className="section-head" style={{ marginBottom: 28 }}>
        <div>
          <h2>Checkout</h2>
          <div className="sub">Complete your order</div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("shop")}>
          <Icon name="chevron" size={15} style={{ transform: "rotate(180deg)" }}/> Continue shopping
        </button>
      </div>

      <StepBar step={step}/>

      <div className="checkout-grid">
        {/* LEFT PANEL */}
        <div>

          {/* STEP 0 — Cart review */}
          {step === 0 && (
            <div className="checkout-panel">
              <h3>Review your cart</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {cart.map((i) => (
                  <div key={i._id} className="cart-item">
                    <img src={i.image} alt=""/>
                    <div>
                      <div className="cart-item-name">{i.name}</div>
                      <div className="cart-item-price">LE {i.price.toLocaleString()} × {i.qty}</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: 14 }}>
                      LE {(i.price * i.qty).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div className="promo-row" style={{ marginTop: 20 }}>
                <input
                  placeholder="Promo code (FIT10)"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  disabled={isApplyingPromo}
                />
                <button
                  className="btn btn-ghost"
                  style={{ padding: "9px 14px" }}
                  onClick={() => applyPromo(subtotal)}
                  disabled={isApplyingPromo}
                >
                  {isApplyingPromo ? "Applying..." : "Apply"}
                </button>
              </div>
              {promoApplied && (
                <div style={{ fontSize: 12.5, color: "var(--teal)", fontWeight: 600, marginTop: 6 }}>
                  ✓ {discountPercent}% off applied
                </div>
              )}
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div className="checkout-panel">
              <h3>Delivery details</h3>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>

                <div className="form-row">
                  <div className="field">
                    <label>First name</label>
                    <input value={form.firstName} onChange={set("firstName")} placeholder="First name"/>
                    {errors.firstName && <div className="auth-error">{errors.firstName}</div>}
                  </div>
                  <div className="field">
                    <label>Last name</label>
                    <input value={form.lastName} onChange={set("lastName")} placeholder="Last name"/>
                    {errors.lastName && <div className="auth-error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"/>
                  {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>

                <div className="field">
                  <label>Phone number</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="01xxxxxxxxx"/>
                  {errors.phone && <div className="auth-error">{errors.phone}</div>}
                </div>

                <div className="field">
                  <label>Address</label>
                  <input value={form.address} onChange={set("address")} placeholder="Street, building, floor"/>
                  {errors.address && <div className="auth-error">{errors.address}</div>}
                </div>

                <div className="field">
                  <label>City</label>
                  <input value={form.city} onChange={set("city")} placeholder="Your city"/>
                  {errors.city && <div className="auth-error">{errors.city}</div>}
                </div>

                {/* Payment */}
                <div className="field">
                  <label>Payment method</label>
                  <div className="payment-options">
                    {[
                      { val: "cod",   label: "Cash on delivery", icon: "wallet" },
                      { val: "card",  label: "Credit / Debit card", icon: "card"   },
                      { val: "vodafone", label: "Vodafone Cash", icon: "phone"  },
                    ].map((opt) => (
                      <label key={opt.val} className={"payment-opt" + (form.payment === opt.val ? " active" : "")}>
                        <input
                          type="radio"
                          name="payment"
                          value={opt.val}
                          checked={form.payment === opt.val}
                          onChange={set("payment")}
                          style={{ display: "none" }}
                        />
                        <Icon name={opt.icon} size={18}/>
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2 — Confirm */}
          {step === 2 && (
            <div className="checkout-panel">
              <h3>Confirm your order</h3>
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>

                <div className="confirm-row">
                  <span className="confirm-label">Name</span>
                  <span>{form.firstName} {form.lastName}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Email</span>
                  <span>{form.email}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Phone</span>
                  <span>{form.phone}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Address</span>
                  <span>{form.address}, {form.city}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Payment</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {form.payment === "cod" ? "Cash on delivery" : form.payment === "card" ? "Credit / Debit card" : "Vodafone Cash"}
                  </span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-label">Total</span>
                  <span style={{ fontWeight: 700, color: "var(--teal)", fontSize: 17 }}>
                    LE {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="checkout-nav">
            {step > 0 && (
              <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn-teal" style={{ marginLeft: "auto" }} onClick={handleNext}>
                {step === 0 ? "Continue to details" : "Review order"} <Icon name="chevron" size={15}/>
              </button>
            ) : (
              <button className="btn btn-primary" style={{ marginLeft: "auto" }} onClick={handlePlace} disabled={isPlacing}>
                <Icon name="check" size={15}/> {isPlacing ? "Placing order..." : "Place order"}
              </button>
            )}
          </div>

        </div>

        {/* RIGHT — Order Summary */}
        <OrderSummary
          cart={cart}
          discount={discount}
          shipping={shipping}
          total={total}
          promoApplied={promoApplied}
          promoCode={promo}
        />
      </div>
    </div>
  );
}