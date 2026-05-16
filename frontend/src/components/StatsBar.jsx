import "./StatsBar.css";
import PropTypes from "prop-types";

function StatsBar({ stats }) {
  const blockedRate = stats.total > 0
    ? ((stats.blocked / stats.total) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      label: "TOTAL REQUESTS",
      value: stats.total?.toLocaleString() || "0",
      color: "blue",
      trend: null,
    },
    {
      label: "THREATS BLOCKED",
      value: stats.blocked?.toLocaleString() || "0",
      color: "red",
      trend: "up",
    },
    {
      label: "BLOCK RATE",
      value: `${blockedRate}%`,
      color: "orange",
      trend: null,
    },
    {
      label: "AVG RISK SCORE",
      value: stats.avg_risk ? stats.avg_risk.toFixed(3) : "0.000",
      color: "purple",
      trend: stats.avg_risk > 0.5 ? "up" : null,
    },
    {
      label: "ACTIVE AGENTS",
      value: stats.active_agents || 0,
      color: "green",
      trend: null,
    }
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-${card.color}`}>
          <span className="stat-value tabular">{card.value}</span>
          <div className="stat-footer">
            <span className="stat-label mono">{card.label}</span>
            {card.trend === "up" && <span className="stat-trend trend-up mono">↑</span>}
            {card.trend === "down" && <span className="stat-trend trend-down mono">↓</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

StatsBar.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    blocked: PropTypes.number,
    avg_risk: PropTypes.number,
    active_agents: PropTypes.number,
  }).isRequired,
};

export default StatsBar;