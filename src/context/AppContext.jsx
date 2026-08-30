import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ORDERS_SEED } from "../data/products.jsx";
import api from "../api/axios";

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
    const h = window.location.hash.replace(/^#\/?/, "") || "landing";
    const parts = h.split("/");
    return { route: parts[0], params: parts.slice(1) };
  };
  const [{ route, params }, setLoc] = useState(parseHash);

  useEffect(() => {
    const onHash = () => {
      setLoc(parseHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = "#/" + path;
  }, []);

  const [theme, setTheme] = useLocalStorage("uxnin.theme", "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const [cart, setCart]       = useLocalStorage("uxnin.cart", []);
  const [wishlist, setWishlist] = useState([]);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const applyPromo = useCallback(async (subtotal) => {
    if (!promo.trim() || isApplyingPromo) return;
    setIsApplyingPromo(true);
    try {
      const { data } = await api.post("/coupons/validate", {
        code: promo.trim(),
        orderAmount: subtotal,
      });
      setPromoApplied(true);
      setDiscountPercent(data.discountPercent);
      pushToast(`${data.code} applied — ${data.discountPercent}% off!`);
      return data;
    } catch (err) {
      setPromoApplied(false);
      setDiscountPercent(0);
      pushToast(err.response?.data?.message || "Invalid promo code.");
      throw err;
    } finally {
      setIsApplyingPromo(false);
    }
  }, [promo, isApplyingPromo]);

  const clearPromo = useCallback(() => {
    setPromo("");
    setPromoApplied(false);
    setDiscountPercent(0);
  }, []);
  const [orders, setOrders]   = useLocalStorage("uxnin.orders", ORDERS_SEED);
  const [user, setUser]       = useLocalStorage("uxnin.user", null);

    const logout = useCallback(() => {
      setUser(null);
      localStorage.removeItem("token");
      setWishlist([]);
      navigate("home");
    }, [setUser, navigate]);

  const addToCart = useCallback((p, qty = 1) => {
    setCart((prev) => {
      const ex = prev.find((i) => i._id === p._id);
      if (ex) return prev.map((i) => i._id === p._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...p, qty }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }, [setCart]);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i._id !== id));
    setCart((prev) => prev.map((i) => i._id === id ? { ...i, qty } : i));
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo("");
    setPromoApplied(false);
    setDiscountPercent(0);
  }, [setCart]);

  // جلب الـ wishlist من الباك إند لما المستخدم يعمل login (أو عند تحميل الصفحة لو فيه user محفوظ)
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    let cancelled = false;
    api.get("/wishlist")
      .then((res) => {
        if (!cancelled) setWishlist(res.data);
      })
      .catch((err) => {
        if (!cancelled) console.error("فشل جلب الـ wishlist:", err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleWishlist = useCallback((p) => {
    if (!user) {
      pushToast("سجّل دخول الأول عشان تضيف للمفضلة", "default");
      return;
    }

    const alreadyWished = wishlist.some((i) => i._id === p._id);

    if (alreadyWished) {
      // Optimistic update: نشيله من الـ state فورًا، ولو الـ request فشل نرجّعه
      setWishlist((prev) => prev.filter((i) => i._id !== p._id));
      api.delete(`/wishlist/${p._id}`)
        .then((res) => setWishlist(res.data))
        .catch((err) => {
          console.error("فشل حذف المنتج من الـ wishlist:", err.message);
          setWishlist((prev) => [...prev, p]); // رجّع الحالة زي ما كانت
        });
    } else {
      setWishlist((prev) => [...prev, p]);
      api.post(`/wishlist/${p._id}`)
        .then((res) => setWishlist(res.data))
        .catch((err) => {
          console.error("فشل إضافة المنتج للـ wishlist:", err.message);
          setWishlist((prev) => prev.filter((i) => i._id !== p._id));
        });
    }
  }, [user, wishlist]);

  const isWished = useCallback((id) => wishlist.some((p) => p._id === id), [wishlist]);

  const [recentlyViewed, setRecentlyViewed] = useLocalStorage("uxnin.recentlyViewed", []);

  const addRecentlyViewed = useCallback((id) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 4));
  }, [setRecentlyViewed]);

  const placeOrder = useCallback((total) => {
    const newOrder = {
      id: "UX-" + (2849 + orders.length),
      customer: user ? user.name : "Youssef Nader",
      total,
      status: "processing",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  }, [orders.length, setOrders, clearCart, user]);

  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((msg, type = "default") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    const duration = type === "removed" ? 2000 : 2500;
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const value = {
    route, params, navigate,
    theme, setTheme,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    wishlist, toggleWishlist, isWished,
    recentlyViewed, addRecentlyViewed,
    orders, placeOrder,
    user, setUser, logout,
    pushToast,
    toasts, removeToast,
    drawerOpen, setDrawerOpen,
    promo, setPromo, promoApplied, discountPercent, isApplyingPromo, applyPromo, clearPromo,
  };

  return (
    <AppCtx.Provider value={value}>
      {children}
    </AppCtx.Provider>
  );
}