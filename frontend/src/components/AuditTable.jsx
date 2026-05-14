import { useState } from "react";
import PropTypes from "prop-types";
import "./AuditTable.css";

function AuditTable({ logs }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = logs.filter(log => {
    const matchesFilter =
      filter === "all" ||
      (filter === "blocked" && log.blocked) ||
      (filter === "allowed" && !log.blocked);
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.agent_id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="audit-table">
      <div className="audit-header">
        <div>
          <h2 className="audit-title mono">AUDIT LOG</h2>
          <p className="audit-sub mono">{filtered.length} ENTRIES</p>
        </div>
        <div className="audit-controls">
          <input
            type="text"
            placeholder="SEARCH LOGS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input mono"
          />
          <div className="filter-btns">
            {["all", "blocked", "allowed"].map(f => (
              <button
                key={f}
                className={`filter-btn mono ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th className="mono">TIME</th>
              <th className="mono">AGENT</th>
              <th className="mono">USER</th>
              <th className="mono">VERDICT</th>
              <th className="mono">RISK</th>
              <th className="mono">INTENT</th>
              <th className="mono">MESSAGE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-row mono">
                  NO LOGS FOUND
                </td>
              </tr>
            )}
            {filtered.map(log => (
              <tr key={log.id} className={log.blocked ? "row-blocked" : "row-allowed"}>
                <td className="mono time-col">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="mono agent-col">
                  {log.agent_id.toUpperCase()}
                </td>
                <td className="mono user-col">
                  {log.user_id}
                </td>
                <td>
                  <span className={`verdict-pill mono ${log.blocked ? "deny" : "allow"}`}>
                    {log.blocked ? "DENY" : "ALLOW"}
                  </span>
                </td>
                <td className={`mono risk-col ${log.risk_score > 0.5 ? "high" : log.risk_score > 0.2 ? "med" : "low"}`}>
                  {log.risk_score?.toFixed(3)}
                </td>
                <td className="mono intent-col">
                  {log.intent?.toUpperCase()}
                </td>
                <td className="message-col">
                  {log.message.length > 60
                    ? log.message.substring(0, 60) + "..."
                    : log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

AuditTable.propTypes = {
    logs: PropTypes.bool.isRequired,
}

export default AuditTable;