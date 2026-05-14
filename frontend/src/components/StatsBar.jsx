import "./StatsBar.css";
import PropTypes from "prop-types";

function StatsBar({ stats }) {
  const blockedRate = stats.total > 0
    ? ((stats.blocked / stats.total) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      label: "TOTAL REQUESTS",
      value: stats.total || 0,
      color: "blue"
    },
    {
      label: "THREATS BLOCKED",
      value: stats.blocked || 0,
      color: "red"
    },
    {
      label: "BLOCK RATE",
      value: `${blockedRate}%`,
      color: "orange"
    },
    {
      label: "AVG RISK SCORE",
      value: stats.avg_risk ? stats.avg_risk.toFixed(3) : "0.000",
      color: "purple"
    },
    {
      label: "ACTIVE AGENTS",
      value: stats.active_agents || 0,
      color: "green"
    }
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-${card.color}`}>
          <span className="stat-value mono">{card.value}</span>
          <span className="stat-label mono">{card.label}</span>
        </div>
      ))}
    </div>
  );
}

StatsBar.propTypes = {
    stats: PropTypes.bool.isRequired,
}

export default StatsBar;