import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

const NAV_LINKS = [
  {
    to: "home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: "shop",
    label: "Shop",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    to: "products",
    label: "Products",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    to: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: "contact",
    label: "Contact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const { route, navigate, cart, wishlist, theme, setTheme, setDrawerOpen } = useApp();

  const dark = theme === "dark";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlist.length;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`shop`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const toggleDark = () => setTheme(dark ? "light" : "dark");

  return (
    <>
      <nav
        className="navbar"
        style={{position: "fixed",
        top: "36px",
        left: 0,
          right: 0,
          width: "100%",
          height: "var(--nav-height)",
          zIndex: 900,
          background: "var(--navy)",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.18)" : "none",
          transition: "box-shadow 0.3s",
          borderBottom: "1px solid var(--nav-border, rgba(255,255,255,0.07))",
        }}
      >
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.25rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}>

          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--teal)",
              padding: "6px",
              borderRadius: 8,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Logo */}
          <a
            href="#/home"
            onClick={(e) => { e.preventDefault(); navigate("home"); }}
            style={{
              fontWeight: 800,
              fontSize: "1.35rem",
              letterSpacing: "-0.5px",
              color: "var(--teal)",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            UX<span style={{ color: "var(--coral)" }}>NIN</span>
          </a>

          {/* Desktop Nav Links */}
          <div
            className="desktop-links"
            style={{ display: "flex", alignItems: "center", gap: "0.15rem", marginLeft: "0.5rem" }}
          >
            {NAV_LINKS.map(({ to, label }) => {
              const active = route === to;
              return (
                <a
                  key={to}
                  href={`#/${to}`}
                  onClick={(e) => { e.preventDefault(); navigate(to); }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: "0.88rem",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--teal)" : "rgba(255,255,255,0.72)",
                    textDecoration: "none",
                    background: active ? "rgba(0,212,180,0.1)" : "transparent",
                    transition: "all 0.18s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.72)"; }}
                >
                  {label}
                </a>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div ref={searchRef} style={{ position: "relative" }}>
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((p) => !p)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.7)", padding: "6px", borderRadius: 8,
                display: "flex", alignItems: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  position: "absolute", right: 0, top: "calc(100% + 10px)",
                  background: "var(--card-bg, #162032)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px",
                  display: "flex", gap: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  zIndex: 999, minWidth: 260,
                }}
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 7, padding: "7px 12px",
                    color: "#fff", fontSize: "0.88rem", outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "var(--teal)", border: "none", borderRadius: 7,
                    padding: "7px 14px", color: "#0b1622",
                    fontWeight: 700, cursor: "pointer", fontSize: "0.85rem",
                  }}
                >
                  Go
                </button>
              </form>
            )}
          </div>

          {/* Wishlist */}
          <button
            aria-label={`Wishlist (${wishlistCount})`}
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.7)", padding: "6px", borderRadius: 8,
              position: "relative", display: "flex", alignItems: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                background: "var(--coral)", color: "#fff",
                fontSize: "0.6rem", fontWeight: 700,
                borderRadius: "50%", width: 15, height: 15,
                display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
              }}>{wishlistCount}</span>
            )}
          </button>

          {/* Cart */}
          <a
            href="#/cart"
            onClick={(e) => { e.preventDefault(); navigate("cart"); }}
            aria-label={`Cart (${cartCount})`}
            style={{
              position: "relative", color: "rgba(255,255,255,0.7)",
              padding: "6px", borderRadius: 8,
              display: "flex", alignItems: "center", textDecoration: "none",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0,
                background: "var(--teal)", color: "#0b1622",
                fontSize: "0.6rem", fontWeight: 800,
                borderRadius: "50%", width: 15, height: 15,
                display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
              }}>{cartCount}</span>
            )}
          </a>

          {/* Dark Mode Toggle */}
          <button
            aria-label="Toggle dark mode"
            onClick={toggleDark}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "5px 8px", cursor: "pointer",
              color: dark ? "var(--amber)" : "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", transition: "all 0.2s",
            }}
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 1000,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.28s ease",
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: 280,
          background: "var(--drawer-bg, #0f1c2d)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          zIndex: 1001,
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column",
          boxShadow: "8px 0 40px rgba(0,0,0,0.4)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.1rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.5px", color: "var(--teal)" }}>
            UX<span style={{ color: "var(--coral)" }}>NIN</span>
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, width: 34, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.7)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
          <p style={{
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            padding: "0 0.75rem", marginBottom: "0.5rem",
          }}>Navigation</p>
          {NAV_LINKS.map(({ to, label, icon }, i) => {
            const active = route === to;
            return (
              <a
                key={to}
                href={`#/${to}`}
                onClick={(e) => { e.preventDefault(); navigate(to); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.75rem 0.85rem", borderRadius: 10, marginBottom: "0.2rem",
                  textDecoration: "none",
                  background: active ? "rgba(0,212,180,0.1)" : "transparent",
                  border: active ? "1px solid rgba(0,212,180,0.2)" : "1px solid transparent",
                  color: active ? "var(--teal)" : "rgba(255,255,255,0.75)",
                  fontWeight: active ? 700 : 500, fontSize: "0.95rem",
                  transition: "all 0.18s",
                  animation: menuOpen ? `drawerItemIn 0.35s ease ${i * 0.05 + 0.1}s both` : "none",
                }}
              >
                <span style={{
                  opacity: active ? 1 : 0.65,
                  color: active ? "var(--teal)" : "inherit",
                  display: "flex", alignItems: "center", flexShrink: 0,
                }}>{icon}</span>
                {label}
                {active && (
                  <span style={{
                    marginLeft: "auto", width: 6, height: 6,
                    borderRadius: "50%", background: "var(--teal)", flexShrink: 0,
                  }} />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>UXNIN © 2025</span>
          <button
            onClick={toggleDark}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "5px 10px", cursor: "pointer",
              color: dark ? "var(--amber)" : "rgba(255,255,255,0.6)",
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.78rem", fontWeight: 600,
            }}
          >{dark ? "☀️ Light" : "🌙 Dark"}</button>
        </div>
      </div>

      <style>{`
        @keyframes drawerItemIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-links { display: none !important; }
        }
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
          .desktop-links { display: flex !important; }
        }
      `}</style>
    </>
  );
}