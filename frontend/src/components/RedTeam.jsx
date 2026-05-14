import { useState } from "react";
import PropTypes from "prop-types";
import "./RedTeam.css";

const ATTACKS = {
  prompt_injection: {
    name: "Prompt Injection",
    desc: "Attempts to override agent system instructions",
    severity: "CRITICAL",
    color: "#f85149"
  },
  data_exfiltration: {
    name: "Data Exfiltration",
    desc: "Attempts to extract and send sensitive data externally",
    severity: "HIGH",
    color: "#e3b341"
  },
  role_impersonation: {
    name: "Role Impersonation",
    desc: "Attempts to impersonate admin or privileged user",
    severity: "HIGH",
    color: "#e3b341"
  },
  pii_extraction: {
    name: "PII Extraction",
    desc: "Attempts to extract personal identifiable information",
    severity: "MEDIUM",
    color: "#bc8cff"
  },
  malware_request: {
    name: "Malware Request",
    desc: "Attempts to generate malicious exfiltration scripts",
    severity: "CRITICAL",
    color: "#f85149"
  }
};

const AGENTS = ["financebot", "medbot", "devbot"];

function RedTeam({ apiUrl, onRefresh }) {
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("financebot");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const runAttack = async () => {
    if (!selectedAttack || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${apiUrl}/redteam/attack/${selectedAttack}?agent_id=${selectedAgent}`,
        { method: "POST" }
      );
      const data = await res.json();
      setResult(data);
      setHistory(prev => [{
        attack: selectedAttack,
        agent: selectedAgent,
        verdict: data.verdict,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 20));
      onRefresh();
    } catch (e) {
      console.error("Attack execution failed:", e);
      setResult({ error: "Connection failed", details: e.message });
    }
    setLoading(false);
  };

  return (
    <div className="redteam">
      <div className="redteam-header">
        <div>
          <h2 className="redteam-title mono">RED TEAM SIMULATOR</h2>
          <p className="redteam-sub mono">FIRE ADVERSARIAL ATTACKS AGAINST ENTERPRISE AGENTS</p>
        </div>
        <div className="threat-level mono">
          THREAT SIMULATION MODE <span className="accent-red">ACTIVE</span>
        </div>
      </div>

      <div className="redteam-grid">
        {/* Attack Selection */}
        <div className="rt-panel">
          <div className="panel-header">
            <span className="panel-title mono">SELECT ATTACK VECTOR</span>
          </div>
          <div className="attack-list">
            {Object.entries(ATTACKS).map(([id, attack]) => (
              <button
                key={id}
                className={`attack-card ${selectedAttack === id ? "selected" : ""}`}
                onClick={() => setSelectedAttack(id)}
                style={{ "--attack-color": attack.color }}
              >
                <div className="attack-top">
                  <span className="attack-name">{attack.name}</span>
                  <span
                    className="severity-badge mono"
                    style={{ color: attack.color, borderColor: attack.color }}
                  >
                    {attack.severity}
                  </span>
                </div>
                <p className="attack-desc mono">{attack.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Target + Fire */}
        <div className="rt-panel">
          <div className="panel-header">
            <span className="panel-title mono">TARGET & EXECUTE</span>
          </div>
          <div className="target-section">
            <p className="section-label mono">TARGET AGENT</p>
            <div className="agent-targets">
              {AGENTS.map(agent => (
                <button
                  key={agent}
                  className={`target-btn mono ${selectedAgent === agent ? "selected" : ""}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  {agent.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="attack-preview">
              {selectedAttack ? (
                <>
                  <p className="section-label mono">ATTACK PAYLOAD</p>
                  <div className="payload-box mono">
                    {ATTACKS[selectedAttack]?.desc}
                  </div>
                </>
              ) : (
                <div className="payload-box mono empty">
                  SELECT AN ATTACK VECTOR TO PREVIEW PAYLOAD
                </div>
              )}
            </div>

            <button
              className={`fire-btn mono ${loading ? "firing" : ""}`}
              onClick={runAttack}
              disabled={!selectedAttack || loading}
            >
              {loading ? "⚡ EXECUTING..." : "⚡ LAUNCH ATTACK"}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`attack-result ${result.blocked ? "blocked" : "passed"}`}>
              <div className="result-header mono">
                <span className="result-verdict">
                  {result.blocked ? "⛔ ATTACK BLOCKED" : "⚠ ATTACK PASSED"}
                </span>
                <span className="result-rule">
                  {result.response?.security?.ingress?.rule_name || ""}
                </span>
              </div>
              <div className="result-meta mono">
                <div className="meta-row">
                  <span>VERDICT</span>
                  <span className={result.verdict === "DENY" ? "red" : "green"}>
                    {result.verdict}
                  </span>
                </div>
                <div className="meta-row">
                  <span>RISK SCORE</span>
                  <span className="orange">
                    {result.response?.security?.ingress?.detected?.risk_score?.toFixed(3) || "0.000"}
                  </span>
                </div>
                <div className="meta-row">
                  <span>INTENT</span>
                  <span>{result.response?.security?.ingress?.detected?.intent_category || "—"}</span>
                </div>
                <div className="meta-row">
                  <span>INJECTION DETECTED</span>
                  <span className={result.response?.security?.ingress?.detected?.contains_injection_patterns ? "red" : "green"}>
                    {result.response?.security?.ingress?.detected?.contains_injection_patterns ? "YES" : "NO"}
                  </span>
                </div>
                <div className="meta-row">
                  <span>EXFILTRATION DETECTED</span>
                  <span className={result.response?.security?.ingress?.detected?.contains_exfiltration ? "red" : "green"}>
                    {result.response?.security?.ingress?.detected?.contains_exfiltration ? "YES" : "NO"}
                  </span>
                </div>
              </div>
              <div className="result-response">
                <p className="section-label mono">AGENT RESPONSE</p>
                <p className="response-text">
                  {result.response?.reply || "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Attack History */}
        <div className="rt-panel">
          <div className="panel-header">
            <span className="panel-title mono">ATTACK HISTORY</span>
            <span className="mono" style={{ fontSize: "10px", color: "var(--text-secondary)" }}>
              {history.length} ATTEMPTS
            </span>
          </div>
          <div className="history-list">
            {history.length === 0 && (
              <div className="feed-empty mono">NO ATTACKS FIRED YET</div>
            )}
            {history.map((h) => (
              <div key={`${h.attack}-${h.timestamp}`} className={`history-item ${h.verdict === "DENY" ? "blocked" : "passed"}`}>
                <div className="history-left">
                  <span className={`mono verdict-sm ${h.verdict === "DENY" ? "red" : "orange"}`}>
                    {h.verdict === "DENY" ? "⛔ BLOCKED" : "⚠ PASSED"}
                  </span>
                  <span className="mono history-attack">{h.attack.replace("_", " ").toUpperCase()}</span>
                </div>
                <div className="history-right">
                  <span className="mono history-agent">{h.agent.toUpperCase()}</span>
                  <span className="mono history-time">{h.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

RedTeam.propTypes = {
    apiUrl: PropTypes.bool.isRequired,
    onRefresh: PropTypes.bool.isRequired,
}

export default RedTeam;