import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext.jsx";

const TYPE_STYLES = {
  cart:     { background: "#059669", color: "#fff" },
  wishlist: { background: "#7c3aed", color: "#fff" },
  removed:  { background: "#4b5563", color: "#fff" },
  default:  { background: "var(--navy)", color: "#fff" },
};

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 300,
      display: "flex", flexDirection: "column-reverse", gap: 8,
      alignItems: "flex-end", pointerEvents: "none",
    }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={() => removeToast(t.id)}
            style={{
              ...(TYPE_STYLES[t.type] || TYPE_STYLES.default),
              padding: "11px 20px",
              borderRadius: 99,
              fontSize: 13.5,
              fontWeight: 600,
              boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              userSelect: "none",
              pointerEvents: "auto",
            }}
          >
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
