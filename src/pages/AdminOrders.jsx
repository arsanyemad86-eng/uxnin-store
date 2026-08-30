import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useApp } from "../context/AppContext.jsx";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { user, pushToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        pushToast(err.response?.data?.message || "فشل تحميل الطلبات", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: data.status } : o)));
      pushToast("تم تحديث حالة الطلب");
    } catch (err) {
      pushToast(err.response?.data?.message || "فشل تحديث الحالة", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <h2>غير مصرح لك بالدخول لهذه الصفحة</h2>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: "40px 0", textAlign: "center" }}>...جاري التحميل</div>;
  }

  return (
    <div style={{ padding: "24px 0" }}>
      <h1 style={{ marginBottom: 20 }}>إدارة الطلبات ({orders.length})</h1>

      {orders.length === 0 ? (
        <p>لا توجد طلبات حتى الآن.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: "10px 8px" }}>Order ID</th>
                <th style={{ padding: "10px 8px" }}>العميل</th>
                <th style={{ padding: "10px 8px" }}>التاريخ</th>
                <th style={{ padding: "10px 8px" }}>الإجمالي</th>
                <th style={{ padding: "10px 8px" }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "10px 8px" }}>#{o._id.slice(-6)}</td>
                  <td style={{ padding: "10px 8px" }}>
                    {o.shippingInfo?.firstName} {o.shippingInfo?.lastName}
                    <br />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{o.user?.email}</span>
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{o.total} LE</td>
                  <td style={{ padding: "10px 8px" }}>
                    <select
                      value={o.status}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}