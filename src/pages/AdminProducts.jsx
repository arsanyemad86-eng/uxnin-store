import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useApp } from "../context/AppContext.jsx";

const emptyForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  oldPrice: "",
  category: "",
  countInStock: "",
  image: "",
};

export default function AdminProducts() {
  const { user, pushToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = إضافة، غير null = تعديل
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      pushToast(err.response?.data?.message || "فشل تحميل المنتجات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      pushToast("اختر صورة الأول", "error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const { data } = await api.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image: data.imageUrl }));
      pushToast("تم رفع الصورة بنجاح");
    } catch (err) {
      pushToast(err.response?.data?.message || "فشل رفع الصورة", "error");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      pushToast("لازم ترفع صورة الأول", "error");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        pushToast("تم تعديل المنتج بنجاح");
      } else {
        await api.post("/products", form);
        pushToast("تم إضافة المنتج بنجاح");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      pushToast(err.response?.data?.message || "فشل حفظ المنتج", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      description: p.description || "",
      price: p.price ?? "",
      oldPrice: p.oldPrice ?? "",
      category: p.category || "",
      countInStock: p.countInStock ?? "",
      image: p.image || "",
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("متأكد إنك عايز تمسح المنتج ده؟");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      pushToast("تم حذف المنتج");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) resetForm(); // لو كنت بتعدّل نفس المنتج اللي اتمسح
    } catch (err) {
      pushToast(err.response?.data?.message || "فشل حذف المنتج", "error");
    } finally {
      setDeletingId(null);
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
      {/* --- فورم إضافة/تعديل منتج --- */}
      <div style={{ marginBottom: 32, padding: 16, border: "1px solid #333", borderRadius: 8 }}>
        <h2 style={{ marginBottom: 16 }}>
          {editingId ? "تعديل منتج" : "إضافة منتج جديد"}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
          <input name="name" placeholder="اسم المنتج" value={form.name} onChange={handleFormChange} required />
          <input name="brand" placeholder="الماركة" value={form.brand} onChange={handleFormChange} required />
          <textarea name="description" placeholder="الوصف" value={form.description} onChange={handleFormChange} required />
          <input name="price" type="number" placeholder="السعر" value={form.price} onChange={handleFormChange} required />
          <input name="oldPrice" type="number" placeholder="السعر قبل الخصم (اختياري)" value={form.oldPrice} onChange={handleFormChange} />
          <input name="category" placeholder="الفئة (مثال: whey-protein)" value={form.category} onChange={handleFormChange} required />
          <input name="countInStock" type="number" placeholder="المخزون" value={form.countInStock} onChange={handleFormChange} required />

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            <button type="button" onClick={handleImageUpload} disabled={uploading}>
              {uploading ? "...جاري الرفع" : "ارفع الصورة"}
            </button>
          </div>

          {form.image && (
            <img src={form.image} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={saving}>
              {saving ? "...جاري الحفظ" : editingId ? "حفظ التعديلات" : "حفظ المنتج"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} disabled={saving}>
                إلغاء التعديل
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- جدول المنتجات --- */}
      <h1 style={{ marginBottom: 20 }}>إدارة المنتجات ({products.length})</h1>

      {products.length === 0 ? (
        <p>لا توجد منتجات حتى الآن.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: "10px 8px" }}>الصورة</th>
                <th style={{ padding: "10px 8px" }}>الاسم</th>
                <th style={{ padding: "10px 8px" }}>الفئة</th>
                <th style={{ padding: "10px 8px" }}>السعر</th>
                <th style={{ padding: "10px 8px" }}>المخزون</th>
                <th style={{ padding: "10px 8px" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "10px 8px" }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                    />
                  </td>
                  <td style={{ padding: "10px 8px" }}>{p.name}</td>
                  <td style={{ padding: "10px 8px" }}>{p.category}</td>
                  <td style={{ padding: "10px 8px" }}>{p.price} ج.م</td>
                  <td style={{ padding: "10px 8px" }}>{p.countInStock}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleEditClick(p)}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #4a9eff",
                          borderRadius: 4,
                          background: "transparent",
                          color: "#4a9eff",
                          cursor: "pointer",
                        }}
                      >
                      تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid #e05555",
                          borderRadius: 4,
                          background: "transparent",
                          color: "#e05555",
                          cursor: "pointer",
                        }}
                      >
                      {deletingId === p._id ? "...جاري الحذف" : "حذف"}
                      </button>
                    </div>
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