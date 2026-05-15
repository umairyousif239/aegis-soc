import { useState } from "react";
import PropTypes from "prop-types";
import "./AgentPanel.css";

const AGENTS = {
  financebot: { name: "FinanceBot", desc: "Invoice queries & financial data", color: "#00C49F", icon: "💰" },
  medbot: { name: "MedBot", desc: "HR & health benefits", color: "#FF6B6B", icon: "🏥" },
  devbot: { name: "DevBot", desc: "Engineering & code assistance", color: "#6C63FF", icon: "💻" }
};

function AgentPanel({ apiUrl, onRefresh, fullWidth }) {
  const [activeAgent, setActiveAgent] = useState("financebot");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage("");
    setConversation(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/v1/agents/${activeAgent}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      const reply = data.response?.reply || "No response";
      const security = data.response?.security || {};
      setConversation(prev => [...prev, {
        role: "agent",
        content: reply,
        verdict: security.verdict,
        risk: security.ingress?.detected?.risk_score
      }]);
      onRefresh();
    } catch (e) {
      console.error("Agent chat request failed:", e);
      setConversation(prev => [...prev, { role: "error", content: "Connection error" }]);
    }
    setLoading(false);
  };

  const agent = AGENTS[activeAgent];

  return (
    <div className={`agent-panel ${fullWidth ? "full-width" : ""}`}>
      <div className="panel-header">
        <span className="panel-title mono">AGENT INTERFACE</span>
      </div>

      <div className="agent-selector">
        {Object.entries(AGENTS).map(([id, a]) => (
          <button
            key={id}
            className={`agent-btn ${activeAgent === id ? "active" : ""}`}
            onClick={() => { setActiveAgent(id); setConversation([]); }}
            style={{ "--agent-color": a.color }}
          >
            <span className="agent-icon">{a.icon}</span>
            <div className="agent-info">
              <span className="agent-name">{a.name}</span>
              <span className="agent-desc mono">{a.desc}</span>
            </div>
            <span className="agent-status mono">ONLINE</span>
          </button>
        ))}
      </div>

      <div className="conversation">
        {conversation.length === 0 && (
          <div className="conv-empty mono">
            SELECT AN AGENT AND START A CONVERSATION
          </div>
        )}
        {conversation.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <span className="msg-role mono">
              {msg.role === "user" ? "YOU" : msg.role === "error" ? "ERROR" : agent.name.toUpperCase()}
            </span>
            <p className="msg-content">{msg.content}</p>
            {msg.verdict && (
              <span className={`msg-verdict mono ${msg.verdict === "DENY" ? "deny" : "allow"}`}>
                {msg.verdict} — RISK {msg.risk?.toFixed(3) || "0.000"}
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="message agent loading">
            <span className="msg-role mono">{agent.name.toUpperCase()}</span>
            <p className="msg-content mono">PROCESSING...</p>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Send a message to the agent..."
          className="mono"
        />
        <button onClick={sendMessage} disabled={loading} className="send-btn mono">
          {loading ? "..." : "SEND"}
        </button>
      </div>
    </div>
  );
}

AgentPanel.propTypes = {
    apiUrl: PropTypes.bool.isRequired,
    onRefresh: PropTypes.bool.isRequired,
    fullWidth: PropTypes.bool.isRequired,
};

export default AgentPanel;