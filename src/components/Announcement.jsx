import React from "react";

export default function Announcement() {
  return (
    <div
      className="announce"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 901,
      }}
    >
      🚚 Free delivery on orders over <strong>LE 300</strong> — Use code <strong>FIT10</strong> for 10% off your first order
    </div>
  );
}
