import React, { useState } from "react";
import Icon from "../components/Icon.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "general", msg: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", subject: "general", msg: "" });
  };

  return (
    <div>
      <div className="section-head" style={{margin: "24px 0 18px"}}>
        <div>
          <h2>Get in touch</h2>
          <div className="sub">Questions, partnerships, or order support — we're here.</div>
        </div>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-card">
            <div className="ico"><Icon name="mail" size={18}/></div>
            <div><div className="label">Email</div><div className="val">support@uxnin.com</div></div>
          </div>
          <div className="info-card">
            <div className="ico"><Icon name="phone" size={18}/></div>
            <div><div className="label">Phone</div><div className="val">+20 100 123 4567</div></div>
          </div>
          <div className="info-card">
            <div className="ico"><Icon name="map" size={18}/></div>
            <div><div className="label">Showroom</div><div className="val">Cairo, Egypt — Open Sat–Thu, 10:00–22:00</div></div>
          </div>
          <div className="info-card">
            <div className="ico"><Icon name="truck" size={18}/></div>
            <div><div className="label">Delivery</div><div className="val">Egypt-wide · 2–4 business days</div></div>
          </div>
        </div>
        <form className="form-card" onSubmit={submit}>
          <h3>Send a message</h3>
          <div className="form-row">
            <div className="field">
              <label>Full name</label>
              <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Your name"/>
            </div>
            <div className="field">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="you@email.com"/>
            </div>
          </div>
          <div className="field">
            <label>Subject</label>
            <select value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}>
              <option value="general">General inquiry</option>
              <option value="order">Order support</option>
              <option value="wholesale">Wholesale</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
          <div className="field">
            <label>Message</label>
            <textarea required value={form.msg} onChange={(e) => setForm({...form, msg: e.target.value})} placeholder="Tell us what you need..."/>
          </div>
          <button className="btn btn-teal" type="submit">
            {sent ? "✓ Message sent" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
