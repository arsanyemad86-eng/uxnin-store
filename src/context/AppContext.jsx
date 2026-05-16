import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ORDERS_SEED } from "../data/products.js";
import Icon from "../components/Icon.jsx";

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const v = window.localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }) {
  const parseHash = () => {
    const h = window.location.hash.replace(/^#\/?/, "") || "home";
    const parts = h.split("/");
    return { route: parts[0], params: parts.slice(1) };
  };
  const [{ route, params }, setLoc] = useState(parseHash);

  useEffect(() => {
    const onHash = () => {
      setLoc(parseHash());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = "#/" + path;
  }, []);

  const [theme, setTheme] = useLocalStorage("uxnin.theme", "light");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const [cart, setCart] = useLocalStorage("uxnin.cart", []);
  const [wishlist, setWishlist] = useLocalStorage("uxnin.wishlist", []);
  const [orders, setOrders] = useLocalStorage("uxnin.orders", ORDERS_SEED);

  const addToCart = useCallback((p, qty = 1) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...p, qty }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, [setCart]);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  }, [setCart]);

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback((p) => {
    setWishlist((prev) => prev.find((i) => i.id === p.id)
      ? prev.filter((i) => i.id !== p.id)
      : [...prev, p]);
  }, [setWishlist]);

  const isWished = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);

  const placeOrder = useCallback((total) => {
    const newOrder = {
      id: "UX-" + (2849 + orders.length),
      customer: "You",
      total,
      status: "processing",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [orders.length, setOrders, clearCart]);

  const [toast, setToast] = useState({ msg: "", show: false });
  const tRef = useRef();
  const pushToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const value = {
    route, params, navigate,
    theme, setTheme,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    wishlist, toggleWishlist, isWished,
    orders, placeOrder,
    pushToast,
    drawerOpen, setDrawerOpen,
  };

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className={"toast" + (toast.show ? " show" : "")}>
        <Icon name="check" size={16}/>{toast.msg}
      </div>
    </AppCtx.Provider>
  );
}
