import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "⬡",
    title: "Full Traffic Interception",
    desc: "Every agent request and response routed through Lobster Trap DPI — not just reports, not just alerts. Everything.",
    accent: "cyan"
  },
  {
    icon: "⚡",
    title: "Live Red Team Simulator",
    desc: "Fire prompt injection, data exfiltration, PII extraction, and role impersonation attacks at your agents in real time. Watch defenses respond.",
    accent: "red"
  },
  {
    icon: "🛡",
    title: "Autonomous Threat Detection",
    desc: "Lobster Trap scores every interaction for risk, intent mismatch, injection patterns, and exfiltration attempts — before damage is done.",
    accent: "green"
  },
  {
    icon: "📊",
    title: "Immutable Audit Trail",
    desc: "Every agent interaction logged with full security metadata. Risk scores, verdicts, intent categories — queryable and filterable.",
    accent: "purple"
  },
  {
    icon: "🤖",
    title: "Multi-Agent Governance",
    desc: "Monitor FinanceBot, MedBot, and DevBot simultaneously. Each agent isolated, each interaction inspected.",
    accent: "blue"
  },
  {
    icon: "⚙",
    title: "Gemini 2.5 Flash Powered",
    desc: "Agent intelligence backed by Google's fastest reasoning model. Security layer is model-agnostic — works with any LLM backend.",
    accent: "orange"
  }
];

const ROADMAP = [
  {
    icon: "🧠",
    title: "Agent Health Scoring",
    desc: "Live 0-100 security score per agent, computed from risk trends, block rate, and request volume.",
    status: "in-progress",
    label: "IN DEVELOPMENT"
  },
  {
    icon: "🗺",
    title: "Threat Heatmap",
    desc: "Visual grid showing which agent × attack type combinations have been triggered, colored by risk level.",
    status: "in-progress",
    label: "IN DEVELOPMENT"
  },
  {
    icon: "📋",
    title: "SOC2 Compliance Export",
    desc: "One-click full compliance report generation with Gemini-written executive summary.",
    status: "coming",
    label: "COMING SOON"
  },
  {
    icon: "🔔",
    title: "Real-time Threat Alerts",
    desc: "Instant notifications when risk scores spike or new attack patterns are detected across your agent fleet.",
    status: "coming",
    label: "COMING SOON"
  },
];

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function LandingPage({ onEnter }) {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/audit/stats`)
      .then(r => r.json())
      .then(data => setLiveStats(data))
      .catch(() => {});
  }, []);

  const STATS = [
    {
      value: liveStats ? liveStats.total.toLocaleString() : "—",
      label: "Requests Inspected"
    },
    {
      value: liveStats ? liveStats.blocked.toLocaleString() : "—",
      label: "Threats Blocked"
    },
    {
      value: liveStats ? `${((liveStats.blocked / Math.max(liveStats.total, 1)) * 100).toFixed(1)}%` : "—",
      label: "Block Rate"
    },
    {
      value: "<50ms",
      label: "Security Overhead"
    },
  ];

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-wordmark">
          <span className="wordmark-icon">⬡</span>
          <span className="wordmark-text">PANTHEON</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate("/pricing"); }}>Pricing</a>
          <button className="nav-cta" onClick={onEnter}>Launch SOC →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge mono">— AI AGENT SECURITY OPERATIONS CENTER</div>
        <h1 className="hero-headline">
          Your agents are live.<br />
          <span className="hero-accent">Who's watching them?</span>
        </h1>
        <p className="hero-sub">
          Pantheon intercepts, inspects, and red-teams every enterprise AI agent in real time.
          Full traffic visibility. Live threat simulation. Zero blind spots.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onEnter}>
            Enter Command Center →
          </button>
          <a href="#how-it-works" className="btn-ghost">See How It Works</a>
        </div>

        {/* Live stats strip */}
        <div className="hero-stats">
          {STATS.map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value tabular">{s.value}</span>
              <span className="hero-stat-label mono">{s.label}</span>
              {s.live && (
                <span className="live-dot" />
              )}
            </div>
          ))}
        </div>
        {liveStats && (
          <div className="live-indicator mono">
            <span className="live-dot-inline" />
            LIVE DATA — {liveStats.active_agents} AGENTS MONITORED
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-label mono">— HOW IT WORKS</div>
        <h2 className="section-title">Security baked into the pipeline</h2>
        <div className="pipeline">
          <div className="pipeline-step">
            <div className="step-icon">👤</div>
            <div className="step-label mono">USER</div>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step highlight">
            <div className="step-icon">⬡</div>
            <div className="step-label mono">PANTHEON</div>
            <div className="step-sub mono">FastAPI + WebSocket</div>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step highlight accent-red-border">
            <div className="step-icon">🔒</div>
            <div className="step-label mono">LOBSTER TRAP</div>
            <div className="step-sub mono">DPI Inspection</div>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step">
            <div className="step-icon">🤖</div>
            <div className="step-label mono">GEMINI 2.5</div>
            <div className="step-sub mono">Flash</div>
          </div>
        </div>
        <p className="pipeline-note mono">
          Every request inspected for injection patterns, exfiltration attempts, intent mismatch,
          and PII extraction — before reaching the model.
        </p>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label mono">— CAPABILITIES</div>
        <h2 className="section-title">Everything a real SOC needs</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className={`feature-card accent-${f.accent}`}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="roadmap" id="roadmap">
        <div className="section-label mono">— ROADMAP</div>
        <h2 className="section-title">What's coming next</h2>
        <div className="roadmap-grid">
          {ROADMAP.map(item => (
            <div key={item.title} className={`roadmap-card status-${item.status}`}>
              <div className="roadmap-top">
                <span className="roadmap-icon">{item.icon}</span>
                <span className={`roadmap-badge mono status-${item.status}`}>{item.label}</span>
              </div>
              <h3 className="roadmap-title">{item.title}</h3>
              <p className="roadmap-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-label mono">— READY TO DEPLOY</div>
        <h2 className="cta-title">
          The enterprise AI attack surface<br />is growing. Start watching it.
        </h2>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}>
          <button className="btn-primary btn-large" onClick={onEnter}>
            Launch Pantheon →
          </button>
          <button
            className="btn-ghost btn-large"
            onClick={() => navigate("/pricing")}
            style={{ padding: "18px 32px" }}
          >
            View Pricing
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="wordmark-text" style={{ fontSize: "14px", letterSpacing: "3px" }}>PANTHEON</span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/pricing")}
            style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-secondary)", textDecoration: "none", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Pricing
          </button>
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            Built with Gemini 2.5 Flash + Veea Lobster Trap · TechEx Hackathon 2025
          </span>
        </div>
      </footer>
    </div>
  );
}

LandingPage.propTypes = {
  onEnter: PropTypes.func.isRequired,
};