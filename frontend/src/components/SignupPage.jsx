import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return;
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("pantheon_token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Connection failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-grid" aria-hidden="true" />
        <div className="auth-brand-top">
          <div className="auth-brand-wordmark">
            <span className="wordmark-icon">⬡</span>
            <span className="wordmark-text">PANTHEON</span>
          </div>
          <h2 className="auth-brand-headline">
            AI agents need<br />a security layer.<br /><span>Yours starts here.</span>
          </h2>
          <p className="auth-brand-sub">
            Deploy in minutes. Inspect every request. Block every injection.
            Built for teams that can't afford blind spots.
          </p>
        </div>
        <div className="auth-brand-bottom">
          <span className="auth-brand-tag mono">TECHEX HACKATHON 2025 · GEMINI 2.5 FLASH</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Start securing your AI agents today</p>
          </div>

          <div className="auth-fields">
            <div className="field-group">
              <label className="field-label mono">EMAIL</label>
              <input
                type="email"
                className="field-input mono"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label mono">PASSWORD</label>
              <input
                type="password"
                className="field-input mono"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label mono">CONFIRM PASSWORD</label>
              <input
                type="password"
                className="field-input mono"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSignup()}
              />
            </div>
          </div>

          {error && <div className="auth-error mono">{error}</div>}

          <button
            className={`auth-btn ${loading ? "loading" : ""}`}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
          </button>

          <div className="auth-switch">
            <span>Already have an account?</span>
            <button onClick={() => navigate("/login")}>Sign in</button>
          </div>

          <button className="auth-back" onClick={() => navigate("/")}>
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
