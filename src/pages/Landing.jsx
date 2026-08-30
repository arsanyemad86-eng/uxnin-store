import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApp } from "../context/AppContext.jsx";
import { PRODUCTS } from "../data/products.jsx";

gsap.registerPlugin(ScrollTrigger);

const HERO_PRODUCT = PRODUCTS.find((p) => p.category === "whey-protein");

const STACK_PRODUCTS = [
  PRODUCTS.find((p) => p.category === "whey-protein"),
  PRODUCTS.find((p) => p.category === "creatine"),
  PRODUCTS.find((p) => p.category === "mass"),
  PRODUCTS.find((p) => p.category === "pre-workout"),
  PRODUCTS.find((p) => p.category === "vitamins"),
  PRODUCTS.find((p) => p.category === "beta-alanine"),
].filter(Boolean);

function StackCard({ product, index }) {
  return (
    <div className="landing-stack-card">
      <div className="landing-stack-card-num">{String(index + 1).padStart(2, "0")}</div>
      <div className="landing-stack-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="landing-stack-card-body">
        <div className="landing-stack-card-brand">{product.brand}</div>
        <div className="landing-stack-card-name">{product.name}</div>
        <div className="landing-stack-card-price">LE {product.price.toLocaleString()}</div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { navigate } = useApp();

  const rootRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  const heroRef = useRef(null);
  const labelRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const ctaRef = useRef(null);
  const productWrapRef = useRef(null);
  const productFloatRef = useRef(null);

  const stackTitleRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  const storeSectionRef = useRef(null);
  const storeH2Ref = useRef(null);
  const storeCtaRef = useRef(null);

  const goToStore = () => navigate("home");

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.body.classList.add("lenis-smooth", "landing-active");

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.body.classList.remove("lenis-smooth", "landing-active");
    };
  }, []);

  /* ── Custom cursor (dot + lagging ring) ── */
  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX - 4, y: mouseY - 4 });
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX - 20, y: ringY - 20 });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── Hero entrance + parallax + stack scroll + section 3 reveal ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Stagger reveal on load */
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { clipPath: "inset(100% 0 0 0)", y: 30 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.9, stagger: 0.15 },
          "-=0.3"
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4");

      /* Continuous product float */
      if (productFloatRef.current) {
        gsap.to(productFloatRef.current, {
          y: -20,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* Parallax on scroll — product moves up faster than page (0.4x) */
      if (productWrapRef.current && heroRef.current) {
        gsap.to(productWrapRef.current, {
          y: () => -window.innerHeight * 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* Horizontal scroll stack — desktop only */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + (track.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true,
          },
        });

        return () => tween.scrollTrigger && tween.scrollTrigger.kill();
      });

      /* Section 3 reveal */
      if (storeH2Ref.current) {
        gsap.fromTo(
          storeH2Ref.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: storeSectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
          }
        );
      }
      if (storeCtaRef.current) {
        gsap.fromTo(
          storeCtaRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)",
            scrollTrigger: { trigger: storeSectionRef.current, start: "top 60%", toggleActions: "play none none reverse" },
          }
        );
      }
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="landing-page" ref={rootRef}>
      <div className="landing-cursor-dot" ref={cursorDotRef} />
      <div className="landing-cursor-ring" ref={cursorRingRef} />

      {/* SECTION 1 — Hero */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero-content">
          <div className="landing-hero-label" ref={labelRef}>EGYPT'S #1 SUPPLEMENT STORE</div>
          <h1 className="landing-hero-h1">
            <span className="landing-h1-line white" ref={line1Ref}>FUEL</span>
            <span className="landing-h1-line outline" ref={line2Ref}>REAL</span>
            <span className="landing-h1-line white" ref={line3Ref}>PERFORMANCE</span>
          </h1>
          <button className="landing-hero-cta" ref={ctaRef} onClick={goToStore}>
            Enter Store →
          </button>
        </div>

        <div className="landing-hero-product-wrap" ref={productWrapRef}>
          <div className="landing-hero-glow" />
          <div className="landing-hero-product-float" ref={productFloatRef}>
            {HERO_PRODUCT && <img src={HERO_PRODUCT.image} alt={HERO_PRODUCT.name} />}
          </div>
        </div>

        <div className="landing-scroll-indicator">
          <span>SCROLL</span>
          <div className="landing-scroll-line" />
        </div>
      </section>

      {/* SECTION 2 — Horizontal scroll stack */}
      <div className="landing-stack-wrap">
        <h2 className="landing-stack-title" ref={stackTitleRef}>THE LINEUP</h2>
        <div className="landing-stack-pin" ref={pinRef}>
          <div className="landing-stack-track" ref={trackRef}>
            {STACK_PRODUCTS.map((p, i) => (
              <StackCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3 — Enter Store */}
      <section className="landing-store-section" ref={storeSectionRef}>
        <div className="landing-store-num">01</div>
        <div className="landing-store-content">
          <h2 className="landing-store-h2" ref={storeH2Ref}>START YOUR STACK</h2>
          <p className="landing-store-sub">Premium supplements. Real brands. Verified quality.</p>
          <button className="landing-store-cta" ref={storeCtaRef} onClick={goToStore}>
            ENTER STORE
          </button>
        </div>
        <div className="landing-store-copyright">© UXNIN 2026</div>
      </section>
    </div>
  );
}
