import PropTypes from "prop-types";
import "./ThreatTimeline.css";

function ThreatTimeline({ logs }) {
  // Bucket logs by hour over last 24 hours
  const now = Date.now();
  const HOURS = 12; // show last 12 hours

  const buckets = Array.from({ length: HOURS }, (_, i) => {
    const hStart = now - (HOURS - i) * 3600000;
    const hEnd = hStart + 3600000;
    const label = new Date(hStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return { label, start: hStart, end: hEnd, total: 0, blocked: 0, maxRisk: 0 };
  });

  logs.forEach(log => {
    const ts = new Date(log.timestamp).getTime();
    const bucket = buckets.find(b => ts >= b.start && ts < b.end);
    if (!bucket) return;
    bucket.total++;
    if (log.blocked) bucket.blocked++;
    if ((log.risk_score || 0) > bucket.maxRisk) bucket.maxRisk = log.risk_score;
  });

  const maxTotal = Math.max(...buckets.map(b => b.total), 1);

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <span className="panel-title mono">THREAT TIMELINE</span>
        <span className="mono timeline-sub">LAST {HOURS} HOURS</span>
      </div>

      <div className="timeline-chart">
        {buckets.map((b, i) => {
          const heightPct = (b.total / maxTotal) * 100;
          const blockedPct = b.total > 0 ? (b.blocked / b.total) * heightPct : 0;
          const allowedPct = heightPct - blockedPct;
          return (
            <div key={i} className="timeline-column" title={`${b.total} total · ${b.blocked} blocked`}>
              <div className="bar-wrap">
                <div className="bar-allowed" style={{ height: `${allowedPct}%` }}></div>
                <div className="bar-blocked" style={{ height: `${blockedPct}%` }}></div>
              </div>
              <span className="bar-label mono">{b.label}</span>
            </div>
          );
        })}
      </div>

      <div className="timeline-legend">
        <div className="tl-legend-item">
          <span className="tl-swatch allowed"></span>
          <span className="mono">ALLOWED</span>
        </div>
        <div className="tl-legend-item">
          <span className="tl-swatch blocked"></span>
          <span className="mono">BLOCKED</span>
        </div>
      </div>
    </div>
  );
}

ThreatTimeline.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default ThreatTimeline;
