import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Icon from "../components/Icon.jsx";
import { CATEGORIES } from "../data/products.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

export default function Dashboard() {
  const { cart, theme } = useApp();
  const barRef = useRef();
  const donutRef = useRef();
  const barInst = useRef();
  const donutInst = useRef();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, statsRes, productsRes] = await Promise.all([
          api.get("/orders/myorders"),
          api.get("/orders/stats/weekly"),
          api.get("/products"),
        ]);
        setOrders(ordersRes.data);
        setWeeklyStats(statsRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const aov = orders.length ? Math.round(revenue / orders.length) : 0;
    const customers = new Set(orders.map((o) => o.shippingInfo?.email)).size;
    const cartItems = cart.reduce((s, i) => s + i.qty, 0);
    return { revenue, ordersCount: orders.length, aov, customers, cartItems };
  }, [orders, cart]);

  useEffect(() => {
    if (!weeklyStats || products.length === 0) return;

    const isDark = theme === "dark";
    const grid = isDark ? "#1d3149" : "#e6eaf0";
    const text = isDark ? "#92a2b8" : "#5b6b80";

    if (barInst.current) barInst.current.destroy();
    barInst.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: weeklyStats.labels,
        datasets: [
          { label: "Sales (LE)", data: weeklyStats.sales, backgroundColor: "#14b8a6", borderRadius: 8, barThickness: 22 },
          { label: "Orders", data: weeklyStats.orders, backgroundColor: "#ff5e5b", borderRadius: 8, barThickness: 22 },
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
    products.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
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
  }, [theme, weeklyStats, products]);

  return (
    <div>
      <div className="section-head" style={{margin: "24px 0 18px"}}>
        <div>
          <h2>Dashboard</h2>
          <div className="sub">Live store overview.</div>
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
          <h3>Sales & orders (last 30 days)</h3>
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
        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o._id} className="row">
              <div style={{fontWeight: 700}}>{o._id.slice(-6).toUpperCase()}</div>
              <div>{o.shippingInfo?.firstName} {o.shippingInfo?.lastName}</div>
              <div style={{fontWeight: 700}}>LE {o.total.toLocaleString()}</div>
              <div className="col-status"><span className={"status " + o.status}>{o.status}</span></div>
              <div className="col-date" style={{color: "var(--text-muted)"}}>
                {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}