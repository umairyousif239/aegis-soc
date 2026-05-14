import "./LiveFeed.css";
import PropTypes from "prop-types";

function LiveFeed({ events }) {
  return (
    <div className="live-feed">
      <div className="panel-header">
        <span className="panel-title mono">LIVE EVENT STREAM</span>
        <span className="event-count mono">{events.length} EVENTS</span>
      </div>

      <div className="feed-list">
        {events.length === 0 && (
          <div className="feed-empty mono">
            AWAITING AGENT ACTIVITY...
          </div>
        )}
        {events.map((event, i) => (
          <div
            key={event.id || `event-${i}`}
            className={`feed-item ${event.blocked ? "blocked" : "allowed"} ${i === 0 ? "fresh" : ""}`}
          >
            <div className="feed-left">
              <span className={`verdict-badge mono ${event.verdict === "DENY" ? "deny" : "allow"}`}>
                {event.verdict === "DENY" ? "⛔ BLOCKED" : "✓ ALLOW"}
              </span>
              <span className="feed-agent mono">{event.agent_id?.toUpperCase()}</span>
            </div>
            <div className="feed-right">
              <span className={`risk-score mono ${event.risk_score > 0.5 ? "high-risk" : ""}`}>
                RISK {event.risk_score?.toFixed(3)}
              </span>
              <span className="feed-time mono">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

LiveFeed.propTypes = {
    events: PropTypes.bool.isRequired,
}

export default LiveFeed;