import { useState } from "react";
import StatsBar from "./StatsBar";
import LiveFeed from "./LiveFeed";
import AgentPanel from "./AgentPanel";
import AuditTable from "./AuditTable";
import RedTeam from "./RedTeam";
import PropTypes from "prop-types";
import "./Dashboard.css";
import "./Header.css";

const NAV_ITEMS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "agents", label: "AGENTS" },
  { id: "redteam", label: "RED TEAM" },
  { id: "audit", label: "AUDIT LOG" },
];

export default function Dashboard({ events, stats, logs, connected, apiUrl, onRefresh }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">PANTHEON</span>
            <span className="logo-sub">AI SECURITY OPERATIONS CENTER</span>
          </div>
        </div>
        <nav className="header-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <div className={`connection-status ${connected ? "connected" : "disconnected"}`}>
            <span className="status-dot" />
            {connected ? "LIVE" : "OFFLINE"}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar stats={stats} />

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === "overview" && (
          <div className="overview-grid">
            <div className="overview-left">
              <LiveFeed events={events} />
            </div>
            <div className="overview-right">
              <AgentPanel apiUrl={apiUrl} onRefresh={onRefresh} />
            </div>
          </div>
        )}
        {activeTab === "agents" && (
          <AgentPanel apiUrl={apiUrl} onRefresh={onRefresh} fullWidth />
        )}
        {activeTab === "redteam" && (
          <RedTeam apiUrl={apiUrl} onRefresh={onRefresh} />
        )}
        {activeTab === "audit" && (
          <AuditTable logs={logs} onRefresh={onRefresh} apiUrl={apiUrl} />
        )}
      </main>
    </div>
  );
}

Dashboard.propTypes = {
    events: PropTypes.bool.isRequired,
    stats: PropTypes.bool.isRequired,
    logs: PropTypes.bool.isRequired,
    connected: PropTypes.bool.isRequired,
    apiUrl: PropTypes.bool.isRequired,
    onRefresh: PropTypes.bool.isRequired,
}