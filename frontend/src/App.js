import { useState, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";
import "./App.css";

const WS_URL = "ws://localhost:8000/ws";
const API_URL = "http://localhost:8000";

function App() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, avg_risk: 0, active_agents: 0 });
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connect, 3000);
      };
      ws.onmessage = (e) => {
        const event = JSON.parse(e.data);
        setEvents(prev => [event, ...prev].slice(0, 50));
        fetchStats();
        fetchLogs();
      };
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/audit/stats`);
    const data = await res.json();
    setStats(data);
  };

  const fetchLogs = async () => {
    const res = await fetch(`${API_URL}/audit/logs?limit=50`);
    const data = await res.json();
    setLogs(data.logs || []);
  };

  return (
    <Dashboard
      events={events}
      stats={stats}
      logs={logs}
      connected={connected}
      apiUrl={API_URL}
      onRefresh={() => { fetchStats(); fetchLogs(); }}
    />
  );
}

export default App;