import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import api from "../api/axios.js";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { navigate, pushToast } = useApp();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (ev) => {
    ev.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_RX.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");

    setBusy(true);
    try {
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setSent(true);
      pushToast("Reset link sent to your email");
    } catch (err) {
      const msg = err.response?.data?.message || "حدث خطأ، حاول مرة أخرى";
      setError(msg);
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
          <h1>Forgot password</h1>
          <p>Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="auth-field">
            <p>
              A password reset link has been sent to <strong>{email}</strong>.
              Check your inbox (and spam folder).
            </p>
            <button
              className="btn btn-teal btn-block"
              type="button"
              onClick={() => navigate("login")}
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <div className={"auth-input-wrap" + (error ? " has-error" : "")}>
                <Icon name="mail" size={18}/>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              {error && <div className="auth-error">{error}</div>}
            </div>

            <button
              className="btn btn-teal btn-block"
              type="submit"
              disabled={busy}
            >
              {busy ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remember your password?{" "}
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