import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Announcement from "./components/Announcement.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WishlistDrawer from "./components/WishlistDrawer.jsx";
import Toast from "./components/Toast.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Home from "./pages/Home.jsx";
import Landing from "./pages/Landing.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";
import Products from "./pages/Products.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import { useApp } from "./context/AppContext.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AdminProducts from "./pages/AdminProducts";

const PAGES = {
  landing: Landing,
  home: Home,
  shop: Shop,
  cart: Cart,
  products: Products,
  dashboard: Dashboard,
  contact: Contact,
  login: Login,
  register: Register,
  "forgot-password": ForgotPassword,
  "reset-password": ResetPassword,
  checkout: Checkout,
  "admin-products": AdminProducts,
  "admin-orders": AdminOrders,
};

const AUTH_ROUTES = ["login", "register", "forgot-password", "reset-password"];

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function App() {
  const { route, params } = useApp();
  const Page = PAGES[route] || Home;
  const animKey = route + (params[0] || "");
  const isAuth = AUTH_ROUTES.includes(route);

  if (route === "landing") {
    return <Landing/>;
  }

  if (isAuth) {
    return (
      <>
        <AnimatePresence mode="wait">
          <motion.main key={animKey} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Page/>
          </motion.main>
        </AnimatePresence>
        <Toast/>
      </>
    );
  }

  return (
    <>
      <Announcement/>
      <Navbar/>
      <AnimatePresence mode="wait">
        <motion.main
          key={animKey}
          className="container page"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Page/>
        </motion.main>
      </AnimatePresence>
      <Footer/>
      <WishlistDrawer/>
      <Toast/>
      <BackToTop/>
    </>
  );
}