import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

const EyeIcon = ({ open }) => (
  <svg
    width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 5.06-5.94"></path>
        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-4.18 5.19"></path>
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </>
    )}
  </svg>
);

export default function ResetPassword() {
  const { navigate, params, pushToast } = useApp();
  const token = params[0];

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();

    if (!token) {
      pushToast("رابط إعادة التعيين غير صالح", "error");
      return;
    }

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      await api.put(`/auth/reset-password/${token}`, {
        password: form.password,
      });
      setDone(true);
      pushToast("تم تغيير كلمة المرور بنجاح");
    } catch (err) {
      const msg = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
      setErrors({ confirm: msg });
      pushToast(msg, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">UXNIN</div>
          <h1>Reset password</h1>
          <p>Choose a new password for your account.</p>
        </div>

        {done ? (
          <div className="auth-field">
            <p>Your password has been changed successfully.</p>
            <button
              className="btn btn-teal btn-block"
              type="button"
              onClick={() => navigate("login")}
            >
              Sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="password">New password</label>
              <div className={"auth-input-wrap" + (errors.password ? " has-error" : "")}>
                <Icon name="shield" size={18}/>
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                />
                <button
                  type="button"
                  className="auth-eye"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowPwd((s) => !s)}
                >
                  <EyeIcon open={!showPwd}/>
                </button>
              </div>
              {errors.password && <div className="auth-error">{errors.password}</div>}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm">Confirm password</label>
              <div className={"auth-input-wrap" + (errors.confirm ? " has-error" : "")}>
                <Icon name="shield" size={18}/>
                <input
                  id="confirm"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => update("confirm", e.target.value)}
                />
              </div>
              {errors.confirm && <div className="auth-error">{errors.confirm}</div>}
            </div>

            <button
              className="btn btn-teal btn-block"
              type="submit"
              disabled={busy}
            >
              {busy ? "Saving..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}