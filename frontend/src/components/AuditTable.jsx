import { useState } from "react";
import PropTypes from "prop-types";
import "./AuditTable.css";

function AuditTable({ logs, apiUrl }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [querying, setQuerying] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  const runQuery = async () => {
    if (!query.trim() || querying) return;
    setQuerying(true);
    setAnswer(null);
    try {
      const res = await fetch(`${apiUrl}/api/v1/audit/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query })
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (e) {
      setAnswer("Failed to query logs. Please try again.");
    }
    setQuerying(false);
  };

  const exportReport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/audit/report/csv`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pantheon-audit-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
    setExporting(false);
  };

  const EXAMPLE_QUERIES = [
    "Which agent has the highest average risk score?",
    "How many attacks were blocked today?",
    "What's the most common intent category?",
    "Show me a summary of red team attacks",
  ];

  return (
    <div className="audit-table">

      {/* NL Query Panel */}
      <div className="query-panel">
        <div className="query-header">
          <span className="panel-title mono">INTELLIGENCE QUERY</span>
          <span className="query-badge mono">GEMINI 2.5 FLASH</span>
        </div>
        <div className="query-input-row">
          <input
            type="text"
            className="query-input mono"
            placeholder="Ask anything about your audit logs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runQuery()}
          />
          <button
            className={`query-btn mono ${querying ? "querying" : ""}`}
            onClick={runQuery}
            disabled={querying}
          >
            {querying ? "ANALYZING..." : "QUERY →"}
          </button>
        </div>
        <div className="example-queries">
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q}
              className="example-chip mono"
              onClick={() => { setQuery(q); }}
            >
              {q}
            </button>
          ))}
        </div>
        {answer && (
          <div className="query-answer">
            <span className="answer-label mono">GEMINI ANALYSIS</span>
            <p className="answer-text">{answer}</p>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="audit-header">
        <div>
          <h2 className="audit-title mono">AUDIT LOG</h2>
          <p className="audit-sub mono">{filtered.length} ENTRIES</p>
        </div>
        <div className="audit-controls">
          <button
            className={`export-btn mono ${exporting ? "exporting" : ""}`}
            onClick={exportReport}
            disabled={exporting}
          >
            {exporting ? "EXPORTING..." : "⬇ EXPORT CSV"}
          </button>
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
  logs: PropTypes.array.isRequired,
  apiUrl: PropTypes.string.isRequired,
};

export default AuditTable;