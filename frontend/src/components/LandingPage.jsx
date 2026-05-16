import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "⬡",
    title: "Full Traffic Interception",
    desc: "Every agent request and response routed through Lobster Trap DPI — not just reports, not just alerts. Full bidirectional inspection before any token reaches your model.",
    accent: "cyan",
  },
  {
    icon: "⚡",
    title: "Live Red Team Simulator",
    desc: "Fire prompt injection, data exfiltration, PII extraction, and role impersonation attacks at your agents in real time. Watch defenses respond, score, and log each attempt.",
    accent: "red",
  },
  {
    icon: "🛡",
    title: "Autonomous Threat Detection",
    desc: "Lobster Trap scores every interaction for risk, intent mismatch, injection patterns, and exfiltration attempts — in under 50ms, before damage is done.",
    accent: "green",
  },
  {
    icon: "📊",
    title: "Immutable Audit Trail",
    desc: "Every agent interaction logged with full security metadata: risk scores, verdicts, intent categories, raw payloads — queryable and filterable in real time.",
    accent: "purple",
  },
  {
    icon: "🤖",
    title: "Multi-Agent Governance",
    desc: "Monitor FinanceBot, MedBot, and DevBot simultaneously. Each agent is isolated, each interaction inspected. One SOC view, complete fleet coverage.",
    accent: "blue",
  },
  {
    icon: "⚙",
    title: "Gemini 2.5 Flash Powered",
    desc: "Security intelligence backed by Google's fastest reasoning model. The inspection layer is model-agnostic — deploy Pantheon in front of any LLM backend.",
    accent: "orange",
  },
];

const ROADMAP = [
  {
    icon: "🧠",
    title: "Agent Health Scoring",
    desc: "Live 0–100 security score per agent, computed from risk trends, block rate, and request volume.",
    status: "shipped",
    label: "SHIPPED",
  },
  {
    icon: "🗺",
    title: "Threat Heatmap",
    desc: "Visual grid showing which agent × attack type combinations have been triggered, colored by risk level.",
    status: "shipped",
    label: "SHIPPED",
  },
  {
    icon: "📋",
    title: "Timeline View",
    desc: "Chronological threat timeline with severity overlays — see when attack clusters hit and how defenses responded.",
    status: "shipped",
    label: "SHIPPED",
  },
  {
    icon: "🔔",
    title: "Slack Alerts",
    desc: "Instant notifications to your team's security channel when risk scores spike or new attack patterns are detected.",
    status: "coming",
    label: "COMING SOON",
  },
  {
    icon: "✏️",
    title: "Custom Policy Editor",
    desc: "Define per-agent inspection rules, allowlists, and block thresholds — without touching code.",
    status: "coming",
    label: "COMING SOON",
  },
  {
    icon: "📄",
    title: "SOC2 Compliance Export",
    desc: "One-click full compliance report generation with Gemini-written executive summary and evidence bundles.",
    status: "coming",
    label: "COMING SOON",
  },
];

const COMPARISON = [
  {
    feature: "Traffic interception (all requests)",
    pantheon: true,
    passive: false,
  },
  {
    feature: "Live red team simulation",
    pantheon: true,
    passive: false,
  },
  {
    feature: "Sub-50ms inline inspection",
    pantheon: true,
    passive: false,
  },
  {
    feature: "Blocks threats before model sees them",
    pantheon: true,
    passive: false,
  },
  {
    feature: "Real-time risk scoring",
    pantheon: true,
    passive: "partial",
  },
  {
    feature: "Immutable audit log",
    pantheon: true,
    passive: true,
  },
  {
    feature: "Multi-agent fleet visibility",
    pantheon: true,
    passive: "partial",
  },
];

const TICKER_EVENTS = [
  { time: "14:32:07", agent: "financebot", verdict: "BLOCKED", msg: "Prompt injection attempt detected — system override payload" },
  { time: "14:32:11", agent: "medbot", verdict: "BLOCKED", msg: "PII extraction attempt — patient record enumeration" },
  { time: "14:32:14", agent: "devbot", verdict: "ALLOWED", msg: "Code review request — risk score 0.02" },
  { time: "14:32:18", agent: "financebot", verdict: "BLOCKED", msg: "Data exfiltration attempt — external URL in payload" },
  { time: "14:32:22", agent: "medbot", verdict: "ALLOWED", msg: "Symptom lookup — risk score 0.04" },
  { time: "14:32:25", agent: "devbot", verdict: "BLOCKED", msg: "Role impersonation — admin privilege escalation" },
  { time: "14:32:29", agent: "financebot", verdict: "ALLOWED", msg: "Balance inquiry — risk score 0.01" },
];

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function LandingPage({ onEnter }) {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState(null);
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/audit/stats`)
      .then(r => r.json())
      .then(data => setLiveStats(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx(prev => (prev + 1) % TICKER_EVENTS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const STATS = [
    { value: liveStats ? liveStats.total.toLocaleString() : "—", label: "Requests Inspected" },
    { value: liveStats ? liveStats.blocked.toLocaleString() : "—", label: "Threats Blocked" },
    { value: liveStats ? `${((liveStats.blocked / Math.max(liveStats.total, 1)) * 100).toFixed(1)}%` : "—", label: "Block Rate" },
    { value: "<50ms", label: "Security Overhead" },
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
          <a href="#why-pantheon">Why Pantheon</a>
          <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate("/pricing"); }}>Pricing</a>
          <button className="nav-cta" onClick={onEnter}>Launch SOC →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-content">
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

          {/* Terminal ticker */}
          <div className="hero-terminal">
            <div className="terminal-header mono">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">pantheon · lobster-trap · live</span>
              <span className="live-dot-inline" />
            </div>
            <div className="terminal-body">
              {TICKER_EVENTS.map((evt, i) => (
                <div
                  key={i}
                  className={`ticker-line mono ${i === tickerIdx ? "ticker-active" : ""} ${i < tickerIdx ? "ticker-past" : ""}`}
                >
                  <span className="ticker-time">{evt.time}</span>
                  <span className="ticker-agent">[{evt.agent}]</span>
                  <span className={`ticker-verdict verdict-${evt.verdict.toLowerCase()}`}>{evt.verdict}</span>
                  <span className="ticker-msg">{evt.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live stats strip */}
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value tabular">{s.value}</span>
                <span className="hero-stat-label mono">{s.label}</span>
              </div>
            ))}
          </div>
          {liveStats && (
            <div className="live-indicator mono">
              <span className="live-dot-inline" />
              LIVE DATA — {liveStats.active_agents} AGENTS MONITORED
            </div>
          )}
        </div>
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
              <div className="feature-top">
                <div className="feature-icon">{f.icon}</div>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Pantheon comparison */}
      <section className="why-pantheon" id="why-pantheon">
        <div className="section-label mono">— ACTIVE VS PASSIVE DEFENSE</div>
        <h2 className="section-title">Why Pantheon?</h2>
        <p className="section-sub">Passive monitoring tools watch threats happen. Pantheon stops them.</p>
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="col-feature" />
            <div className="col-product pantheon-col">
              <span className="wordmark-text" style={{ fontSize: "14px", letterSpacing: "3px" }}>PANTHEON</span>
              <span className="col-sub mono">Active defense</span>
            </div>
            <div className="col-product passive-col">
              <span className="col-name">Passive tools</span>
              <span className="col-sub mono">Observe only</span>
            </div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={i} className="comparison-row">
              <div className="col-feature mono">{row.feature}</div>
              <div className="col-product pantheon-col">
                <span className="check-yes">✓</span>
              </div>
              <div className="col-product passive-col">
                {row.passive === true && <span className="check-yes passive">✓</span>}
                {row.passive === false && <span className="check-no">✗</span>}
                {row.passive === "partial" && <span className="check-partial">~</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="roadmap" id="roadmap">
        <div className="section-label mono">— ROADMAP</div>
        <h2 className="section-title">Built fast, shipping faster</h2>
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
        <span className="wordmark-text" style={{ fontSize: "13px", letterSpacing: "3px" }}>PANTHEON</span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/pricing")}
            style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Pricing
          </button>
          <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            Built with Gemini 2.5 Flash + Veea Lobster Trap · Transforming Enterprise Through AI Hackathon 2026
          </span>
        </div>
      </footer>
    </div>
  );
}

LandingPage.propTypes = {
  onEnter: PropTypes.func.isRequired,
};
