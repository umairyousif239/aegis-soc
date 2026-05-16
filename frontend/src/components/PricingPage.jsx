import { useNavigate } from "react-router-dom";
import "./PricingPage.css";

const PLANS = [
  {
    id: "outpost",
    name: "Outpost",
    price: 49,
    desc: "For solo builders and small teams deploying their first AI agents.",
    accent: "blue",
    features: [
      "Up to 3 AI agents",
      "10,000 inspected requests/mo",
      "Real-time threat detection",
      "7-day audit log retention",
      "Red team simulator (3 attack types)",
      "WebSocket live feed",
      "Community support",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    id: "bastion",
    name: "Bastion",
    price: 149,
    desc: "For growing enterprises running multiple agents across departments.",
    accent: "cyan",
    features: [
      "Up to 15 AI agents",
      "100,000 inspected requests/mo",
      "Real-time threat detection",
      "30-day audit log retention",
      "Full red team simulator (all attack types)",
      "Natural language log querying",
      "Compliance report export",
      "Priority email support",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    id: "citadel",
    name: "Citadel",
    price: 499,
    desc: "For large organizations that need full control, custom policies, and dedicated support.",
    accent: "purple",
    features: [
      "Unlimited AI agents",
      "Unlimited inspected requests",
      "Real-time threat detection",
      "Unlimited audit log retention",
      "Full red team simulator",
      "Natural language log querying",
      "Compliance report export",
      "Custom Lobster Trap policies",
      "SSO & role-based access",
      "Dedicated security engineer",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

const FAQS = [
  {
    q: "What counts as an inspected request?",
    a: "Every message sent to or received from an AI agent is a request. Both ingress (user → agent) and egress (agent → user) are inspected by Lobster Trap."
  },
  {
    q: "Is there a free trial?",
    a: "Yes — all plans include a 14-day free trial with no credit card required. Full access to every feature in your tier."
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. Upgrade or downgrade any time. Changes take effect immediately and are prorated."
  },
  {
    q: "How does Lobster Trap integrate?",
    a: "Pantheon routes all agent traffic through Lobster Trap as a DPI proxy automatically. No configuration needed on your end."
  },
  {
    q: "What's a custom security policy?",
    a: "Citadel customers can define their own Lobster Trap YAML policies — custom block rules, domain allowlists, intent categories, and risk thresholds."
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="pricing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-wordmark" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <span className="wordmark-icon">⬡</span>
          <span className="wordmark-text">PANTHEON</span>
        </div>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/pricing" style={{ color: "var(--text-primary)" }}>Pricing</a>
          <button className="nav-cta" onClick={() => navigate("/dashboard")}>Launch SOC →</button>
        </div>
      </nav>

      {/* Header */}
      <div className="pricing-hero">
        <div className="section-label mono">— PRICING</div>
        <h1 className="pricing-title">
          Secure your agents.<br />
          <span style={{ color: "var(--accent-cyan)" }}>Scale with confidence.</span>
        </h1>
        <p className="pricing-sub">
          14-day free trial on all plans. No credit card required. Cancel any time.
        </p>
      </div>

      {/* Plans */}
      <div className="plans-grid">
        {PLANS.map(plan => (
          <div key={plan.id} className={`plan-card ${plan.popular ? "popular" : ""} accent-${plan.accent}`}>
            {plan.popular
                ? <div className="popular-badge mono">MOST POPULAR</div>
                : <div className="popular-badge-placeholder" />
            }
            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                <span className="price-amount tabular">${plan.price}</span>
                <span className="price-period mono">/mo</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
            </div>
            <button
              className={`plan-cta mono ${plan.popular ? "cta-primary" : "cta-ghost"}`}
              onClick={() => navigate("/dashboard")}
            >
              {plan.cta} →
            </button>
            <div className="plan-features">
              {plan.features.map(f => (
                <div key={f} className="feature-row">
                  <span className="feature-check" style={{ color: `var(--accent-${plan.accent})` }}>✓</span>
                  <span className="feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <div className="section-label mono">— COMMON QUESTIONS</div>
        <h2 className="section-title">Everything you need to know</h2>
        <div className="faq-grid">
          {FAQS.map(faq => (
            <div key={faq.q} className="faq-item">
              <h3 className="faq-q">{faq.q}</h3>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pricing-cta">
        <h2 className="cta-title">Ready to secure your agent fleet?</h2>
        <button className="btn-primary btn-large" onClick={() => navigate("/dashboard")}>
          Start free trial →
        </button>
        <p className="mono" style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "16px" }}>
          No credit card required · 14-day free trial · Cancel anytime
        </p>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <span className="wordmark-text" style={{ fontSize: "14px", letterSpacing: "3px" }}>PANTHEON</span>
        <span className="mono" style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          Built with Gemini 2.5 Flash + Veea Lobster Trap · TechEx Hackathon 2025
        </span>
      </footer>
    </div>
  );
}