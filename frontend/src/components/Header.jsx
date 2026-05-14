import PropTypes from "prop-types";
import "./Header.css";

function Header({ connected }) {
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
        </div>
        </div>
    </header>
    );
}

Header.propTypes = {
    connected: PropTypes.bool.isRequired,
};

export default Header;