import React, { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";
import Icon from "../components/Icon.jsx";
import { PRODUCTS, CATEGORIES } from "../data/products.js";
import { useApp } from "../context/AppContext.jsx";

export default function Dashboard() {
  const { orders, cart, theme } = useApp();
  const barRef = useRef();
  const donutRef = useRef();
  const barInst = useRef();
  const donutInst = useRef();

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const aov = orders.length ? Math.round(revenue / orders.length) : 0;
    const customers = new Set(orders.map((o) => o.customer)).size;
    const cartItems = cart.reduce((s, i) => s + i.qty, 0);
    return { revenue, ordersCount: orders.length, aov, customers, cartItems };
  }, [orders, cart]);

  useEffect(() => {
    const isDark = theme === "dark";
    const grid = isDark ? "#1d3149" : "#e6eaf0";
    const text = isDark ? "#92a2b8" : "#5b6b80";

    if (barInst.current) barInst.current.destroy();
    barInst.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          { label: "Sales (LE)", data: [4200, 5100, 3800, 6700, 7800, 9200, 6400], backgroundColor: "#14b8a6", borderRadius: 8, barThickness: 22 },
          { label: "Orders", data: [12, 18, 14, 22, 26, 30, 21], backgroundColor: "#ff5e5b", borderRadius: 8, barThickness: 22 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { color: text } } },
        scales: {
          x: { grid: { color: grid }, ticks: { color: text } },
          y: { grid: { color: grid }, ticks: { color: text } },
        },
      },
    });

    const catCounts = {};
    PRODUCTS.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
    if (donutInst.current) donutInst.current.destroy();
    donutInst.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(catCounts).map((k) => CATEGORIES.find((c) => c.key === k)?.name || k),
        datasets: [{
          data: Object.values(catCounts),
          backgroundColor: ["#14b8a6", "#ff5e5b", "#f59e0b", "#38bdf8", "#0f2a47", "#7c3aed"],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: { legend: { position: "right", labels: { color: text, boxWidth: 12 } } },
      },
    });

    return () => {
      if (barInst.current) barInst.current.destroy();
      if (donutInst.current) donutInst.current.destroy();
    };
  }, [theme]);

  return (
    <div>
      <div className="section-head" style={{margin: "24px 0 18px"}}>
        <div>
          <h2>Dashboard</h2>
          <div className="sub">Live snapshot from your localStorage data.</div>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="ico"><Icon name="dollar" size={20}/></div>
          <div className="label">Revenue</div>
          <div className="value">LE {stats.revenue.toLocaleString()}</div>
          <div className="delta">↑ 12.4% vs last week</div>
        </div>
        <div className="stat-card coral">
          <div className="ico"><Icon name="package" size={20}/></div>
          <div className="label">Orders</div>
          <div className="value">{stats.ordersCount}</div>
          <div className="delta">↑ 8.1% vs last week</div>
        </div>
        <div className="stat-card amber">
          <div className="ico"><Icon name="trending" size={20}/></div>
          <div className="label">Avg order</div>
          <div className="value">LE {stats.aov.toLocaleString()}</div>
          <div className="delta down">↓ 2.3% vs last week</div>
        </div>
        <div className="stat-card sky">
          <div className="ico"><Icon name="users" size={20}/></div>
          <div className="label">Customers</div>
          <div className="value">{stats.customers}</div>
          <div className="delta">↑ 4 new this week</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Weekly sales & orders</h3>
          <div className="chart-canvas-wrap"><canvas ref={barRef}></canvas></div>
        </div>
        <div className="chart-card">
          <h3>Catalog by category</h3>
          <div className="chart-canvas-wrap"><canvas ref={donutRef}></canvas></div>
        </div>
      </div>

      <div className="orders-table">
        <div className="head">
          <div>Order</div>
          <div>Customer</div>
          <div>Total</div>
          <div className="col-status">Status</div>
          <div className="col-date">Date</div>
        </div>
        {orders.map((o) => (
          <div key={o.id} className="row">
            <div style={{fontWeight: 700}}>{o.id}</div>
            <div>{o.customer}</div>
            <div style={{fontWeight: 700}}>LE {o.total.toLocaleString()}</div>
            <div className="col-status"><span className={"status " + o.status}>{o.status}</span></div>
            <div className="col-date" style={{color: "var(--text-muted)"}}>{o.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
