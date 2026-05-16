import { useState } from "react";
import StatsBar from "./StatsBar";
import LiveFeed from "./LiveFeed";
import AgentPanel from "./AgentPanel";
import AuditTable from "./AuditTable";
import RedTeam from "./RedTeam";
import Header from "./Header";
import PropTypes from "prop-types";
import "./Dashboard.css";

const NAV_ITEMS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "agents", label: "AGENTS" },
  { id: "redteam", label: "RED TEAM" },
  { id: "audit", label: "AUDIT LOG" },
];

export default function Dashboard({ events, stats, logs, connected, apiUrl, onRefresh, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard">
      <Header connected={connected} onLogout={onLogout} />

      <nav className="dashboard-nav">
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

      <StatsBar stats={stats} />

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
  events: PropTypes.array.isRequired,
  stats: PropTypes.object.isRequired,
  logs: PropTypes.array.isRequired,
  connected: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};