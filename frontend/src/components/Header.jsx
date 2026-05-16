import PropTypes from "prop-types";
import "./Header.css";

function Header({ connected, onLogout }) {
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
};

export default Header;