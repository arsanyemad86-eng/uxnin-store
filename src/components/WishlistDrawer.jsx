import React from "react";
import Icon from "./Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function WishlistDrawer() {
  const { drawerOpen, setDrawerOpen, wishlist, toggleWishlist, addToCart, navigate, pushToast } = useApp();
  const close = () => setDrawerOpen(false);

  return (
    <>
      <div className={"drawer-backdrop" + (drawerOpen ? " open" : "")} onClick={close}></div>
      <aside className={"drawer" + (drawerOpen ? " open" : "")}>
        <div className="drawer-head">
          <h3>Wishlist ({wishlist.length})</h3>
          <button className="icon-btn" onClick={close}><Icon name="x" size={18}/></button>
        </div>
        <div className="drawer-body">
          {wishlist.length === 0 && (
            <div className="cart-empty">
              Your wishlist is empty.<br/>Tap the heart on any product to save it.
            </div>
          )}
          {wishlist.map((i) => (
            <div key={i.id} className="cart-item">
              <img src={i.image} alt=""/>
              <div>
                <div className="cart-item-name">{i.name}</div>
                <div className="cart-item-price">LE {i.price.toLocaleString()}</div>
                <div style={{display: "flex", gap: 6, marginTop: 6}}>
                  <button className="btn btn-teal" style={{padding: "5px 10px", fontSize: 12}}
                    onClick={() => { addToCart(i); pushToast("Added to cart"); }}>Add to cart</button>
                  <button className="btn btn-ghost" style={{padding: "5px 10px", fontSize: 12}}
                    onClick={() => { close(); navigate("products/" + i.id); }}>View</button>
                </div>
              </div>
              <button className="remove-btn"
                onClick={() => { toggleWishlist(i); pushToast("Removed"); }}>
                <Icon name="x" size={16}/>
              </button>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          <button className="btn btn-ghost btn-block" onClick={close}>Close</button>
        </div>
      </aside>
    </>
  );
}
