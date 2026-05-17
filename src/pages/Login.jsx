import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export default function Login() {
  const { navigate, pushToast, setUser } = useApp();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())             e.email = "Email is required";
    else if (!EMAIL_RX.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password)                  e.password = "Password is required";
    else if (form.password.length < 6)   e.password = "Password must be at least 6 characters";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      let users = [];
      try {
        users = JSON.parse(window.localStorage.getItem("uxnin_users") || "[]");
      } catch { users = []; }

      const found = users.find(
        (u) => u.email.toLowerCase() === form.email.trim().toLowerCase()
            && u.password === form.password
      );

      if (!found) {
        setErrors({ password: "Incorrect email or password" });
        setBusy(false);
        return;
      }

      const safeUser = { name: found.name, email: found.email };
      setUser(safeUser);
      pushToast("Welcome back!");
      navigate("home");
    } catch {
      pushToast("Something went wrong, try again");
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-brand">UXNIN</div>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your account.</p>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className={"auth-input-wrap" + (errors.email ? " has-error" : "")}>
              <Icon name="mail" size={18}/>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className={"auth-input-wrap" + (errors.password ? " has-error" : "")}>
              <Icon name="shield" size={18}/>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
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

          <div className="auth-options">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => update("remember", e.target.checked)}
              />
              <span className="auth-check-box"></span>
              Remember me
            </label>
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => pushToast("Password reset coming soon")}
            >
              Forgot password?
            </button>
          </div>

          <button
            className="btn btn-teal btn-block"
            type="submit"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="auth-social">
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => pushToast("Google sign-in coming soon")}
          >
            Google
          </button>
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => pushToast("Apple sign-in coming soon")}
          >
            Apple
          </button>
        </div>

        <div className="auth-footer">
          New to UXNIN?{" "}
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => navigate("register")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
