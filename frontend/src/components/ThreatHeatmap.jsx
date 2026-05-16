import React from "react";
import PropTypes from "prop-types";
import "./ThreatHeatmap.css";

const AGENTS = ["financebot", "medbot", "devbot"];
const ATTACK_TYPES = [
  { key: "prompt_injection", label: "PROMPT INJ." },
  { key: "data_exfiltration", label: "DATA EXFIL." },
  { key: "role_impersonation", label: "ROLE IMPERSON." },
  { key: "pii_extraction", label: "PII EXTRACT." },
  { key: "malware_request", label: "MALWARE REQ." },
  { key: "general", label: "GENERAL" },
];

function getRiskColor(risk) {
  if (risk === null) return "var(--bg-secondary)";
  if (risk >= 0.75) return "rgba(248,81,73,0.7)";
  if (risk >= 0.5)  return "rgba(227,179,65,0.6)";
  if (risk >= 0.25) return "rgba(188,140,255,0.5)";
  return "rgba(63,185,80,0.4)";
}

function getRiskLabel(risk) {
  if (risk === null) return "—";
  if (risk >= 0.75) return "CRIT";
  if (risk >= 0.5)  return "HIGH";
  if (risk >= 0.25) return "MED";
  return "LOW";
}

function ThreatHeatmap({ logs }) {
  // Build a matrix: agent x intent → { count, avgRisk }
  const matrix = {};
  AGENTS.forEach(a => {
    matrix[a] = {};
    ATTACK_TYPES.forEach(t => {
      matrix[a][t.key] = { count: 0, totalRisk: 0 };
    });
  });

  logs.forEach(log => {
    const agent = log.agent_id?.toLowerCase();
    const intent = log.intent?.toLowerCase() || "general";
    if (!matrix[agent]) return;
    const bucket = matrix[agent][intent] || matrix[agent]["general"];
    if (!bucket) return;
    const key = matrix[agent][intent] ? intent : "general";
    matrix[agent][key].count++;
    matrix[agent][key].totalRisk += log.risk_score || 0;
  });

  const totalLogs = logs.length;

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <span className="panel-title mono">THREAT HEATMAP</span>
        <span className="mono heatmap-sub">{totalLogs} INTERACTIONS MAPPED</span>
      </div>

      <div className="heatmap-wrap">
        <div className="heatmap-grid" style={{ gridTemplateColumns: `120px repeat(${AGENTS.length}, 1fr)` }}>
          {/* Header row */}
          <div className="heatmap-cell header-cell"></div>
          {AGENTS.map(a => (
            <div key={a} className="heatmap-cell header-cell mono agent-header">
              {a.toUpperCase()}
            </div>
          ))}

          {/* Data rows */}
          {ATTACK_TYPES.map(type => (
            <React.Fragment key={type.key}>
              <div className="heatmap-cell row-label mono">
                {type.label}
              </div>
              {AGENTS.map(agent => {
                const cell = matrix[agent][type.key];
                const avgRisk = cell.count > 0 ? cell.totalRisk / cell.count : null;
                return (
                  <div
                    key={`${agent}-${type.key}`}
                    className="heatmap-cell data-cell"
                    style={{ background: getRiskColor(avgRisk) }}
                    title={cell.count > 0 ? `${cell.count} hits · avg risk ${avgRisk?.toFixed(3)}` : "No data"}
                  >
                    {cell.count > 0 ? (
                      <>
                        <span className="cell-count mono">{cell.count}</span>
                        <span className="cell-label mono">{getRiskLabel(avgRisk)}</span>
                      </>
                    ) : (
                      <span className="cell-empty">—</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="heatmap-legend">
          <span className="legend-title mono">RISK LEVEL</span>
          {[
            { label: "LOW", color: "rgba(63,185,80,0.4)" },
            { label: "MEDIUM", color: "rgba(188,140,255,0.5)" },
            { label: "HIGH", color: "rgba(227,179,65,0.6)" },
            { label: "CRITICAL", color: "rgba(248,81,73,0.7)" },
          ].map(l => (
            <div key={l.label} className="legend-item">
              <span className="legend-swatch" style={{ background: l.color }}></span>
              <span className="legend-label mono">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ThreatHeatmap.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default ThreatHeatmap;
