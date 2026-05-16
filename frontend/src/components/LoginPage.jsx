import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/audit/stats`)
      .then(r => r.json())
      .then(data => setLiveStats(data))
      .catch(() => {});
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
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
            Stop threats<br />before they<br /><span>reach your agents.</span>
          </h2>
          <p className="auth-brand-sub">
            Full traffic interception. Live red team simulation. Immutable audit trail.
            Enterprise AI security that works at inference time.
          </p>
        </div>
        {liveStats && (
          <div className="auth-brand-stats">
            <div className="auth-brand-stat">
              <span className="auth-brand-stat-label mono">REQUESTS INSPECTED</span>
              <span className="auth-brand-stat-value">{liveStats.total.toLocaleString()}</span>
            </div>
            <div className="auth-brand-stat">
              <span className="auth-brand-stat-label mono">THREATS BLOCKED</span>
              <span className="auth-brand-stat-value">{liveStats.blocked.toLocaleString()}</span>
            </div>
            <div className="auth-brand-stat">
              <span className="auth-brand-stat-label mono">AGENTS MONITORED</span>
              <span className="auth-brand-stat-value">{liveStats.active_agents}</span>
            </div>
          </div>
        )}
        <div className="auth-brand-bottom">
          <span className="auth-brand-tag mono">TRANSFORMING ENTERPRISE THROUGH AI HACKATHON · GEMINI 2.5 FLASH</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-sub">Access your security operations center</p>
          </div>

          <div className="demo-hint mono">
            DEMO — demo@pantheon.ai / pantheon2025
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
                onKeyDown={e => e.key === "Enter" && handleLogin()}
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
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {error && <div className="auth-error mono">{error}</div>}

          <button
            className={`auth-btn ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>

          <div className="auth-switch">
            <span>No account?</span>
            <button onClick={() => navigate("/signup")}>Create one</button>
          </div>

          <button className="auth-back" onClick={() => navigate("/")}>
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
