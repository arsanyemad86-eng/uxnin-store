import React from "react";
import Announcement from "./components/Announcement.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import WishlistDrawer from "./components/WishlistDrawer.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";
import Products from "./pages/Products.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useApp } from "./context/AppContext.jsx";

const PAGES = {
  home: Home,
  shop: Shop,
  cart: Cart,
  products: Products,
  dashboard: Dashboard,
  contact: Contact,
  login: Login,
  register: Register,
};

// صفحات من غير navbar وfooter
const AUTH_ROUTES = ["login", "register"];

export default function App() {
  const { route, params } = useApp();
  const Page = PAGES[route] || Home;
  const animKey = route + (params[0] || "");
  const isAuth = AUTH_ROUTES.includes(route);

  if (isAuth) {
    return (
      <main key={animKey}>
        <Page/>
      </main>
    );
  }

  return (
    <>
      <Announcement/>
      <Navbar/>
      <main className="container page" key={animKey}>
        <Page/>
      </main>
      <Footer/>
      <WishlistDrawer/>
    </>
  );
}