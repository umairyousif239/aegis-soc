import PropTypes from "prop-types";
import "./AgentHealth.css";

const AGENTS = ["financebot", "medbot", "devbot"];
const AGENT_LABELS = { financebot: "FINANCE BOT", medbot: "MED BOT", devbot: "DEV BOT" };
const AGENT_ICONS = { financebot: "₿", medbot: "⚕", devbot: "</>" };

function computeHealth(logs, agentId) {
  const agentLogs = logs.filter(l => l.agent_id?.toLowerCase() === agentId);
  if (agentLogs.length === 0) return { score: 100, status: "IDLE", volume: 0, blockRate: 0, avgRisk: 0 };

  const volume = agentLogs.length;
  const blocked = agentLogs.filter(l => l.blocked).length;
  const blockRate = blocked / volume;
  const avgRisk = agentLogs.reduce((s, l) => s + (l.risk_score || 0), 0) / volume;

  // Score: 100 - penalty for risk and blocks
  const riskPenalty = avgRisk * 50;
  const blockPenalty = blockRate * 30;
  const volumePenalty = Math.min(volume / 10, 20); // heavy traffic penalty
  const score = Math.max(0, Math.min(100, 100 - riskPenalty - blockPenalty - volumePenalty));

  let status = "SECURE";
  if (score < 40) status = "CRITICAL";
  else if (score < 60) status = "DEGRADED";
  else if (score < 80) status = "MODERATE";

  return { score: Math.round(score), status, volume, blockRate, avgRisk };
}

function ScoreRing({ score }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color =
    score >= 80 ? "var(--accent-green)" :
    score >= 60 ? "var(--accent-cyan)" :
    score >= 40 ? "var(--accent-orange)" :
    "var(--accent-red)";

  return (
    <svg width="72" height="86" className="score-ring">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.6s ease", filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x="36" y="40" textAnchor="middle" fill={color} fontSize="14" fontFamily="var(--font-mono)" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

function AgentHealth({ logs }) {
  return (
    <div className="agent-health-container">
      <div className="agent-health-header">
        <span className="panel-title mono">AGENT HEALTH SCORES</span>
        <span className="mono" style={{ fontSize: "9px", letterSpacing: "1px", color: "var(--text-dim)" }}>
          LIVE SECURITY RATINGS
        </span>
      </div>
      <div className="health-cards">
        {AGENTS.map(agent => {
          const h = computeHealth(logs, agent);
          return (
            <div key={agent} className={`health-card health-${h.status.toLowerCase()}`}>
              <div className="health-icon mono">{AGENT_ICONS[agent]}</div>
              <div className="health-info">
                <span className="health-agent mono">{AGENT_LABELS[agent]}</span>
                <span className={`health-status mono status-${h.status.toLowerCase()}`}>{h.status}</span>
                <div className="health-stats">
                  <span className="mono hstat">REQ: {h.volume}</span>
                  <span className="mono hstat">BLK: {(h.blockRate * 100).toFixed(0)}%</span>
                  <span className="mono hstat">RISK: {h.avgRisk.toFixed(2)}</span>
                </div>
              </div>
              <ScoreRing score={h.score} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

ScoreRing.propTypes = { score: PropTypes.number.isRequired };
AgentHealth.propTypes = { logs: PropTypes.array.isRequired };

export default AgentHealth;
