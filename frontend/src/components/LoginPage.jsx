import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      <div className="auth-card">
        <div className="auth-wordmark">
          <span className="wordmark-icon">⬡</span>
          <span className="wordmark-text">PANTHEON</span>
        </div>
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
          <span>Don't have an account?</span>
          <button onClick={() => navigate("/signup")}>Sign up</button>
        </div>

        <button
          className="auth-back"
          onClick={() => navigate("/")}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}