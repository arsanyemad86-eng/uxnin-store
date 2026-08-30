import React from "react";
import { CATEGORIES } from "../data/products.jsx"
import { useApp } from "../context/AppContext.jsx";

export default function Footer() {
  const { navigate } = useApp();
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{marginBottom: 10}}>
              <span className="dot"></span>UXNIN
            </div>
            <p style={{color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, maxWidth: 320}}>
              Premium fitness supplements for serious lifters in Egypt.
              Authenticity, quality, performance — every order.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            {CATEGORIES.filter((c) => c.key !== "all").slice(0, 5).map((c) => (
              <a key={c.key} onClick={() => {
                navigate("shop");
                setTimeout(() => window.dispatchEvent(new CustomEvent("uxnin:cat", { detail: c.key })), 50);
              }}>{c.name}</a>
            ))}
          </div>
          <div>
            <h4>Company</h4>
            <a onClick={() => navigate("contact")}>About us</a>
            <a onClick={() => navigate("contact")}>Contact</a>
            <a onClick={() => navigate("dashboard")}>Dashboard</a>
            <a onClick={() => navigate("shop")}>All products</a>
          </div>
          <div>
            <h4>Support</h4>
            <a>Shipping & delivery</a>
            <a>Returns</a>
            <a>FAQ</a>
            <a>Privacy</a>
          </div>
        </div>
        <div className="foot-bottom">© 2026 UXNIN. Built with discipline. All rights reserved.</div>
      </div>
    </footer>
  );
}
