import PropTypes from "prop-types";
import "./Header.css";

function getThreatLevel(avgRisk) {
  if (avgRisk >= 0.75) return { label: "CRITICAL", color: "#f85149", cls: "critical" };
  if (avgRisk >= 0.5)  return { label: "HIGH",     color: "#e3b341", cls: "high" };
  if (avgRisk >= 0.25) return { label: "ELEVATED", color: "#bc8cff", cls: "elevated" };
  return { label: "LOW", color: "#3fb950", cls: "low" };
}

function Header({ connected, onLogout, avgRisk }) {
  const threat = getThreatLevel(avgRisk || 0);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <div className="logo-text">
            <span className="logo-name">PANTHEON</span>
            <span className="logo-sub">AI SECURITY OPERATIONS CENTER</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-meta mono">
          <div className={`threat-badge mono threat-${threat.cls}`} style={{ borderColor: threat.color, color: threat.color }}>
            <span className="threat-pulse" style={{ background: threat.color }}></span>
            THREAT <span style={{ marginLeft: 4 }}>{threat.label}</span>
          </div>
          <span className="meta-item">
            LOBSTER TRAP <span className="accent-green">ACTIVE</span>
          </span>
          <span className="meta-item">
            GEMINI 2.5 FLASH <span className="accent-blue">ONLINE</span>
          </span>
          <span className={`meta-item ws-status ${connected ? "connected" : "disconnected"}`}>
            <span className="status-dot"></span>
            {connected ? "LIVE" : "RECONNECTING"}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "1.5px",
              padding: "5px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = "var(--accent-red)";
              e.target.style.color = "var(--accent-red)";
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  connected: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  avgRisk: PropTypes.number,
};

export default Header;