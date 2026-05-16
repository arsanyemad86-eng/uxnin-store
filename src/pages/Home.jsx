import React, { useMemo } from "react";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS, CATEGORIES, HERO_IMAGE } from "../data/products.js";
import { useApp } from "../context/AppContext.jsx";

const FEATURES = [
  { icon: "truck", title: "Free delivery", sub: "On orders LE 300+" },
  { icon: "shield", title: "100% authentic", sub: "Verified brands only" },
  { icon: "award", title: "Premium quality", sub: "Lab-tested products" },
  { icon: "phone", title: "24/7 support", sub: "We've got your back" },
];

export default function Home() {
  const { navigate } = useApp();
  const featured = useMemo(() => PRODUCTS.filter((p) => p.badge === "Best Seller").slice(0, 4), []);
  const fresh = useMemo(() => PRODUCTS.filter((p) => p.badge === "New").slice(0, 4), []);

  const goToCategory = (cat) => {
    navigate("shop");
    setTimeout(() => window.dispatchEvent(new CustomEvent("uxnin:cat", { detail: cat })), 50);
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <h1>Fuel <span className="accent">Real Performance.</span><br/>Built For Discipline.</h1>
            <p>Premium fitness supplements engineered for serious lifters. Whey, creatine, mass gainers, pre-workout — sourced and verified.</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate("shop")}>
                Shop now <Icon name="chevron" size={15}/>
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("dashboard")}>
                View dashboard
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img src={HERO_IMAGE} alt="Featured"/>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Shop by category</h2>
            <div className="sub">Pick your stack — every category, real brands.</div>
          </div>
        </div>
        <div className="cat-grid">
          {CATEGORIES.filter((c) => c.key !== "all").map((c) => {
            const count = PRODUCTS.filter((p) => p.category === c.key).length;
            return (
              <div key={c.key} className="cat-card" onClick={() => goToCategory(c.key)}>
                <div className="ico">{c.icon}</div>
                <div className="name">{c.name}</div>
                <div className="count">{count} products</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Best sellers</h2>
            <div className="sub">What lifters are stacking right now.</div>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate("shop")}>
            View all <Icon name="chevron" size={15}/>
          </button>
        </div>
        <div className="product-grid">
          {featured.map((p) => <ProductCard key={p.id} product={p}/>)}
        </div>
      </section>

      <section className="section">
        <div className="banner-row">
          <div className="banner-card b1">
            <div>
              <h3>Power your pump.</h3>
              <p>Up to 25% off pre-workout — limited time.</p>
              <button className="btn btn-primary" onClick={() => goToCategory("pre-workout")}>
                Shop pre-workout
              </button>
            </div>
          </div>
          <div className="banner-card b2">
            <div>
              <h3>Code: FIT10</h3>
              <p>10% off your first order — automatic at checkout.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>New arrivals</h2>
            <div className="sub">Fresh stock, just landed.</div>
          </div>
        </div>
        <div className="product-grid">
          {fresh.map((p) => <ProductCard key={p.id} product={p}/>)}
        </div>
      </section>

      <section className="section">
        <div className="cat-grid" style={{gridTemplateColumns: "repeat(4, 1fr)"}}>
          {FEATURES.map((b, i) => (
            <div key={i} className="cat-card" style={{textAlign: "left", padding: "20px"}}>
              <div className="ico" style={{margin: 0, marginBottom: 12}}>
                <Icon name={b.icon} size={22}/>
              </div>
              <div className="name" style={{fontSize: 15}}>{b.title}</div>
              <div className="count" style={{marginTop: 4}}>{b.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
