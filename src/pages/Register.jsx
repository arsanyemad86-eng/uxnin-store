import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STRENGTH_META = [
  { lbl: "Weak",   color: "var(--coral)" },
  { lbl: "Fair",   color: "var(--amber)" },
  { lbl: "Good",   color: "var(--sky)"   },
  { lbl: "Strong", color: "var(--teal)"  },
];

/** Returns 0..4. 0 = empty, 1..4 = weak → strong. */
function scorePassword(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6)              score++;
  if (pwd.length >= 10)             score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4);
}

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

export default function Register() {
  const { navigate, pushToast, setUser } = useApp();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const strength = useMemo(() => scorePassword(form.password), [form.password]);
  const strengthMeta = strength > 0 ? STRENGTH_META[strength - 1] : null;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())            e.firstName = "First name is required";
    if (!form.lastName.trim())             e.lastName  = "Last name is required";
    if (!form.email.trim())                e.email     = "Email is required";
    else if (!EMAIL_RX.test(form.email))   e.email     = "Enter a valid email address";
    if (!form.password)                    e.password  = "Password is required";
    else if (form.password.length < 6)     e.password  = "Password must be at least 6 characters";
    if (!form.confirm)                     e.confirm   = "Confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    if (!form.terms)                       e.terms     = "You must accept the terms";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      await api.post("/auth/register", {
        name,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      pushToast("تم إنشاء الحساب بنجاح، سجّل دخولك الآن");
      navigate("login");
    } catch (err) {
      const msg = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
      setErrors({ email: msg });
      pushToast(msg, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <div className="auth-brand">UXNIN</div>
          <h1>Create your account</h1>
          <p>Join UXNIN and start training smarter today.</p>
        </div>

        <form onSubmit={submit} noValidate>
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="firstName">First name</label>
              <div className={"auth-input-wrap" + (errors.firstName ? " has-error" : "")}>
                <Icon name="user" size={18}/>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Arsany"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              {errors.firstName && <div className="auth-error">{errors.firstName}</div>}
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Last name</label>
              <div className={"auth-input-wrap" + (errors.lastName ? " has-error" : "")}>
                <Icon name="user" size={18}/>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Emad"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
              {errors.lastName && <div className="auth-error">{errors.lastName}</div>}
            </div>
          </div>

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

            {form.password && (
              <div className="auth-strength">
                <div className="strength-bars">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{
                        background: i < strength ? strengthMeta.color : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <div className="strength-lbl" style={{ color: strengthMeta?.color }}>
                  {strengthMeta?.lbl}
                </div>
              </div>
            )}

            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm password</label>
            <div className={"auth-input-wrap" + (errors.confirm ? " has-error" : "")}>
              <Icon name="shield" size={18}/>
              <input
                id="confirm"
                type={showConf ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
              />
              <button
                type="button"
                className="auth-eye"
                aria-label={showConf ? "Hide password" : "Show password"}
                onClick={() => setShowConf((s) => !s)}
              >
                <EyeIcon open={!showConf}/>
              </button>
            </div>
            {errors.confirm && <div className="auth-error">{errors.confirm}</div>}
          </div>

          <div className="auth-terms">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => update("terms", e.target.checked)}
              />
              <span className="auth-check-box"></span>
              I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.terms && <div className="auth-error">{errors.terms}</div>}
          </div>

          <button
            className="btn btn-teal btn-block"
            type="submit"
            disabled={busy}
          >
            {busy ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-divider"><span>or sign up with</span></div>

        <div className="auth-social">
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => pushToast("Google sign-up coming soon")}
          >
            Google
          </button>
          <button
            type="button"
            className="auth-social-btn"
            onClick={() => pushToast("Apple sign-up coming soon")}
          >
            Apple
          </button>
        </div>

        <div className="auth-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => navigate("login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
