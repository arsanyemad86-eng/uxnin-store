import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS, CATEGORIES } from "../data/products.jsx";
import { useApp } from "../context/AppContext.jsx";

gsap.registerPlugin(ScrollTrigger);

/* ── Constants ──────────────────────────────────────────── */
const DEAL_END = Date.now() + 7 * 24 * 3600 * 1000;

const FEATURES = [
  { icon: "truck",   title: "Free delivery",   sub: "On orders LE 300+" },
  { icon: "shield",  title: "100% authentic",  sub: "Verified brands only" },
  { icon: "award",   title: "Premium quality", sub: "Lab-tested products" },
  { icon: "phone",   title: "24/7 support",    sub: "We've got your back" },
];

const HERO_PRODUCTS = [
  PRODUCTS.find((p) => p.category === "whey-protein"),
  PRODUCTS.find((p) => p.category === "creatine"),
  PRODUCTS.find((p) => p.category === "mass"),
];

const FLOAT_CONFIGS = [
  { size: 280, rotate: -5, opacity: 1,    top: "50%", left: "52%", translateY: "-50%",
    floatY: [0,-22,0], floatDuration: 3,   enterDelay: 0.2,
    shadow: "drop-shadow(0 24px 48px rgba(0,212,170,0.35))" },
  { size: 180, rotate:  8, opacity: 0.85, top: "12%", left: "72%", translateY: "0%",
    floatY: [0,-16,0], floatDuration: 4,   enterDelay: 0.4,
    shadow: "drop-shadow(0 16px 32px rgba(0,212,170,0.28))" },
  { size: 160, rotate: -8, opacity: 0.75, top: "68%", left: "65%", translateY: "0%",
    floatY: [0,-14,0], floatDuration: 3.5, enterDelay: 0.6,
    shadow: "drop-shadow(0 14px 28px rgba(0,212,170,0.25))" },
];

/* ── Framer entrance variants ───────────────────────────── */
const heroStagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const heroText    = { hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.5 } } };

/* ── Countdown helpers ──────────────────────────────────── */
function useCountdown(target) {
  const [ms, setMs] = useState(() => target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setMs(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s/86400), h: Math.floor((s%86400)/3600), m: Math.floor((s%3600)/60), s: s%60 };
}

function CountdownUnit({ value, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{
        background: "rgba(255,255,255,0.12)", color: "#fff",
        fontWeight: 800, fontSize: 13, minWidth: 28,
        borderRadius: 5, padding: "2px 5px", textAlign: "center",
        fontVariantNumeric: "tabular-nums",
      }}>
        {String(value).padStart(2, "0")}
      </span>
      <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2, fontWeight: 600, textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ── Flash deal card ────────────────────────────────────── */
function FlashDealCard({ product, innerRef }) {
  const { navigate, addToCart, pushToast } = useApp();
  const { d, h, m, s } = useCountdown(DEAL_END);
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  return (
    <div
      ref={innerRef}
      onClick={() => navigate("products/" + product.id)}
      style={{
        background: "var(--bg-elev)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer",
        display: "flex", flexDirection: "column", willChange: "transform",
      }}
    >
      <div style={{ position: "relative", background: "rgba(255,255,255,0.03)", padding: 12, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ position: "absolute", top: 8, left: 8, background: "var(--coral)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 5 }}>
          -{discount}%
        </span>
        <img src={product.image} alt={product.name} style={{ maxHeight: 130, maxWidth: "100%", objectFit: "contain" }} loading="lazy"/>
      </div>
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{product.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: "auto" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--coral)" }}>LE {product.price.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", textDecoration: "line-through" }}>LE {product.oldPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>Ends:</span>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <CountdownUnit value={d} label="d"/>
            <span style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: 11 }}>:</span>
            <CountdownUnit value={h} label="h"/>
            <span style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: 11 }}>:</span>
            <CountdownUnit value={m} label="m"/>
            <span style={{ fontWeight: 800, color: "var(--text-muted)", fontSize: 11 }}>:</span>
            <CountdownUnit value={s} label="s"/>
          </div>
        </div>
        <button
          className="add-btn"
          style={{ marginTop: 4, padding: "8px", fontSize: 13 }}
          onClick={(e) => { e.stopPropagation(); addToCart(product); pushToast("Added to cart ✓", "cart"); }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function HeroSection({ heroRef, orb1Ref, orb2Ref, orb3Ref, fpRefs, contentRef }) {
  const { navigate } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section ref={heroRef} className="hero-full" style={{ willChange: "transform" }}>
      <div className="hero-dark-bg"/>
      <div ref={orb1Ref} className="hero-orb hero-orb-1" style={{ willChange: "transform" }}/>
      <div ref={orb2Ref} className="hero-orb hero-orb-2" style={{ willChange: "transform" }}/>
      <div ref={orb3Ref} className="hero-orb hero-orb-3" style={{ willChange: "transform" }}/>

      <div className="hero-products-stage" aria-hidden="true">
        {HERO_PRODUCTS.map((product, i) => {
          const cfg = FLOAT_CONFIGS[i];
          if (!product) return null;
          return (
            <motion.div
              key={product.id}
              ref={fpRefs[i]}
              className="hero-product-float"
              style={{ top: cfg.top, left: cfg.left, translateY: cfg.translateY, width: cfg.size, height: cfg.size, rotate: cfg.rotate, willChange: "transform" }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: cfg.opacity, x: 0 }}
              transition={{ duration: 0.7, delay: cfg.enterDelay, ease: "easeOut" }}
            >
              <motion.img
                src={product.image} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: cfg.shadow }}
                animate={{ y: cfg.floatY }}
                transition={{ repeat: Infinity, duration: cfg.floatDuration, ease: "easeInOut", delay: cfg.enterDelay * 0.5 }}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div ref={contentRef} className="hero-full-content" variants={heroStagger} initial="hidden" animate="show" style={{ willChange: "transform" }}>
        <motion.div variants={heroText} className="hero-badge">
          <span className="hero-badge-dot"/>Egypt's #1 Supplement Store
        </motion.div>
        <div className="hero-h1-wrap">
          <motion.div variants={heroText} className="hero-h1-line"><span className="hero-white">Fuel </span><span className="hero-green">Real</span></motion.div>
          <motion.div variants={heroText} className="hero-h1-line"><span className="hero-green">Performance.</span></motion.div>
          <motion.div variants={heroText} className="hero-h1-line"><span className="hero-white">Built For Discipline.</span></motion.div>
        </div>
        <motion.p
          variants={{ hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition:{ duration:0.5, delay:0.5 } } }}
          className="hero-sub"
        >
          Premium fitness supplements engineered for serious lifters.<br/>
          Whey, creatine, mass gainers, pre-workout — sourced and verified.
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition:{ duration:0.5, delay:0.6 } } }}
          className="hero-full-cta"
        >
          <button className="hero-btn-primary" onClick={() => navigate("shop")}>Shop Now →</button>
          <button className="hero-btn-outline" onClick={() => navigate("shop")}>View Deals</button>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity:0, y:16 }, show: { opacity:1, y:0, transition:{ duration:0.5, delay:0.7 } } }}
          className="hero-stats"
        >
          {[{ val:"61+", label:"Products" },{ val:"100%", label:"Authentic" },{ val:"LE 300+", label:"Free delivery" }].map((s,i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="hero-stat-divider"/>}
              <div className="hero-stat"><span className="hero-stat-val">{s.val}</span><span className="hero-stat-label">{s.label}</span></div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!scrolled && (
          <motion.div
            className="hero-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              animate={{ y: [0,8,0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", lineHeight: 1 }}
            >↓</motion.div>
            <span className="hero-scroll-text">Scroll to explore</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Main ───────────────────────────────────────────────── */
export default function Home() {
  const { navigate, pushToast, addToCart } = useApp();

  const featured = useMemo(() => PRODUCTS.filter((p) => p.badge === "Best Seller").slice(0, 4), []);
  const deals    = useMemo(() => PRODUCTS.filter((p) => p.oldPrice > 0).slice(0, 4), []);
  const cats     = CATEGORIES.filter((c) => c.key !== "all");

  /* Refs */
  const heroRef    = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);
  const orb3Ref    = useRef(null);
  const fpRef0     = useRef(null);
  const fpRef1     = useRef(null);
  const fpRef2     = useRef(null);
  const fpRefs     = [fpRef0, fpRef1, fpRef2];
  const contentRef = useRef(null);

  const catSectionRef  = useRef(null);
  const catTitleRef    = useRef(null);
  const catCardsRef    = useRef([]);

  const dealSectionRef = useRef(null);
  const dealTitleRef   = useRef(null);
  const dealCardsRef   = useRef([]);

  const sellerSectionRef = useRef(null);
  const sellerTitleRef   = useRef(null);
  const sellerCardsRef   = useRef([]);

  const newsletterRef = useRef(null);
  const featTitleRef  = useRef(null);

  const goToCategory = (cat) => {
    navigate("shop");
    setTimeout(() => window.dispatchEvent(new CustomEvent("uxnin:cat", { detail: cat })), 50);
  };

  /* GSAP ScrollTrigger */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Hero parallax ── */
      const hero = heroRef.current;
      if (hero) {
        const heroH = hero.offsetHeight;

        [orb1Ref, orb2Ref, orb3Ref].forEach((r) => {
          if (!r.current) return;
          gsap.to(r.current, {
            y: heroH * 0.3,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        });

        const fpSpeeds = [0.2, 0.4, 0.15];
        fpRefs.forEach((r, i) => {
          if (!r.current) return;
          gsap.to(r.current, {
            y: -heroH * fpSpeeds[i],
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        });

        if (contentRef.current) {
          gsap.to(contentRef.current, {
            y: -heroH * 0.1,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        gsap.to(hero, {
          scale: 0.95,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      /* ── Title clip reveal ── */
      const revealTitle = (el) => {
        if (!el) return;
        gsap.fromTo(el,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      };

      /* ── Categories fly in ── */
      revealTitle(catTitleRef.current);
      const catCards = catCardsRef.current.filter(Boolean);
      if (catCards.length) {
        gsap.fromTo(catCards,
          { opacity: 0, y: 80, rotateX: 15 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.7, ease: "power3.out", stagger: 0.08,
            scrollTrigger: { trigger: catSectionRef.current, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" },
          }
        );
      }

      /* ── Flash deals slide from sides ── */
      revealTitle(dealTitleRef.current);
      dealCardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: dealSectionRef.current, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" },
          }
        );
      });

      /* ── Best sellers scale up ── */
      revealTitle(sellerTitleRef.current);
      const sellerCards = sellerCardsRef.current.filter(Boolean);
      if (sellerCards.length) {
        gsap.fromTo(sellerCards,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.6, ease: "back.out(1.7)", stagger: 0.1,
            scrollTrigger: { trigger: sellerSectionRef.current, start: "top 80%", end: "bottom 20%", toggleActions: "play none none reverse" },
          }
        );
      }

      /* ── Newsletter zoom in ── */
      if (newsletterRef.current) {
        gsap.fromTo(newsletterRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: newsletterRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      }

      revealTitle(featTitleRef.current);
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      {/* S1: Hero */}
      <HeroSection
        heroRef={heroRef} orb1Ref={orb1Ref} orb2Ref={orb2Ref} orb3Ref={orb3Ref}
        fpRefs={fpRefs} contentRef={contentRef}
      />

      {/* S2: Categories */}
      <section ref={catSectionRef} className="home-section" style={{ perspective: "1000px" }}>
        <div className="section-head">
          <div>
            <h2 ref={catTitleRef} style={{ willChange: "clip-path" }}>Shop by category</h2>
            <div className="sub">Pick your stack — every category, real brands.</div>
          </div>
        </div>
        <div className="cat-img-grid">
          {cats.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c.key).length;
            const img   = PRODUCTS.find((p) => p.category === c.key)?.image;
            return (
              <div
                key={c.key}
                ref={(el) => { catCardsRef.current[i] = el; }}
                className="cat-img-card"
                onClick={() => goToCategory(c.key)}
                style={{ opacity: 0, willChange: "transform" }}
              >
                <img src={img} alt={c.name}/>
                <div className="cat-img-overlay"/>
                <div className="cat-img-label">
                  <div className="cat-img-name">{c.name}</div>
                  <div className="cat-img-count">{count} products</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* S3: Flash Deals */}
      <section ref={dealSectionRef} className="home-section">
        <div className="section-head">
          <div>
            <h2 ref={dealTitleRef} style={{ willChange: "clip-path" }}>🔥 Flash Deals</h2>
            <div className="sub">Limited-time prices — grab them before they're gone.</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate("shop")}>
            See all <Icon name="chevron" size={13}/>
          </button>
        </div>
        <div className="flash-grid">
          {deals.map((p, i) => (
            <FlashDealCard key={p.id} product={p} innerRef={(el) => { dealCardsRef.current[i] = el; }}/>
          ))}
        </div>
      </section>

      {/* S4: Best Sellers */}
      <section ref={sellerSectionRef} className="home-section" style={{ perspective: "1000px" }}>
        <div className="section-head">
          <div>
            <h2 ref={sellerTitleRef} style={{ willChange: "clip-path" }}>Best sellers</h2>
            <div className="sub">What lifters are stacking right now.</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => navigate("shop")}>
            View all <Icon name="chevron" size={13}/>
          </button>
        </div>
        <div className="products-grid">
          {featured.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { sellerCardsRef.current[i] = el; }}
              style={{ opacity: 0, willChange: "transform" }}
            >
              <ProductCard product={p}/>
            </div>
          ))}
        </div>
      </section>

      {/* S5: Newsletter + Features */}
      <section className="home-section">
        <div
          ref={newsletterRef}
          style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px", opacity: 0, willChange: "transform" }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
            Join the <span style={{ color: "#00d4aa" }}>UXNIN</span> Family
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 26 }}>
            Exclusive deals, new arrival alerts, and fitness tips — straight to your inbox.
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto" }}>
            <input
              type="email"
              placeholder="Enter your email…"
              style={{
                flex: 1, padding: "12px 18px", borderRadius: 999,
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text)", fontSize: 14, outline: "none",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#00d4aa"; e.target.style.boxShadow = "0 0 0 3px rgba(0,212,170,0.12)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={() => pushToast("Subscribed! Welcome to UXNIN 🎉", "cart")}
              style={{
                padding: "12px 24px", borderRadius: 999,
                background: "#00d4aa", color: "#0a0a0f",
                border: "none", fontWeight: 800, fontSize: 14,
                cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.background = "#00c49c"; }}
              onMouseLeave={(e) => { e.target.style.background = "#00d4aa"; }}
            >
              Subscribe
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", marginBottom: 40 }}/>

        <div>
          <h2 ref={featTitleRef} style={{ textAlign: "center", marginBottom: 28, fontSize: 22, willChange: "clip-path" }}>
            Why UXNIN
          </h2>
          <div className="features-strip">
            {FEATURES.map((b, i) => (
              <div key={i} className="cat-card" style={{ textAlign: "left", padding: "22px" }}>
                <div className="ico" style={{ margin: 0, marginBottom: 14 }}>
                  <Icon name={b.icon} size={22}/>
                </div>
                <div className="name" style={{ fontSize: 15 }}>{b.title}</div>
                <div className="count" style={{ marginTop: 4 }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
