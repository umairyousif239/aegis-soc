import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import PricingPage from "./components/PricingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const WS_URL = API_URL.startsWith("https")
  ? API_URL.replace("https", "wss")
  : API_URL.replace("http", "ws");
const FINAL_WS_URL = `${WS_URL}/api/v1/ws`;

function LoadingScreen({ status }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#080c10", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "48px", fontWeight: 700, letterSpacing: "6px", color: "#cdd9e5", lineHeight: 1 }}>
          PANTHEON
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#444c56", marginTop: "8px", textTransform: "uppercase" }}>
          AI Security Operations Center
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "32px" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: "4px", background: "#39d0d8", borderRadius: "2px",
            animation: `barPulse 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "2px", color: "#768390" }}>
        {status}
      </div>
      <style>{`
        @keyframes barPulse {
          0%, 100% { height: 8px; opacity: 0.3; }
          50% { height: 32px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ProtectedRoute({ children, ready }) {
  const token = localStorage.getItem("pantheon_token");
  if (!ready) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppInner() {
  const [ready, setReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("INITIALIZING SYSTEMS...");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, avg_risk: 0, active_agents: 0 });
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const mountedRef = useRef(true);
  const navigate = useNavigate();

  // Track mount state for leak prevention
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let attempts = 0;
    const messages = [
      "INITIALIZING SYSTEMS...",
      "CONNECTING TO BACKEND...",
      "WARMING UP SECURITY LAYER...",
      "ESTABLISHING SECURE CHANNEL...",
      "ALMOST READY...",
    ];
    const poll = async () => {
      if (!mountedRef.current) return;
      setLoadingStatus(messages[Math.min(attempts, messages.length - 1)]);
      attempts++;
      try {
        const res = await fetch(`${API_URL}/api/v1/audit/stats`);
        if (res.ok) {
          setTimeout(() => {
            if (mountedRef.current) setReady(true);
          }, 600);
          return;
        }
      } catch (_) {}
      setTimeout(() => {
        if (mountedRef.current) poll();
      }, 2000);
    };
    poll();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const token = localStorage.getItem("pantheon_token");
    if (!token) return;

    const connect = () => {
      if (!mountedRef.current) return;
      const ws = new WebSocket(FINAL_WS_URL);
      wsRef.current = ws;
      ws.onopen = () => {
        if (mountedRef.current) setConnected(true);
      };
      ws.onclose = () => {
        if (!mountedRef.current) return;
        setConnected(false);
        // Only reconnect if still mounted
        setTimeout(() => {
          if (mountedRef.current) connect();
        }, 3000);
      };
      ws.onmessage = (e) => {
        if (!mountedRef.current) return;
        const event = JSON.parse(e.data);
        setEvents(prev => [event, ...prev].slice(0, 50));
        fetchStats();
        fetchLogs();
      };
    };
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const token = localStorage.getItem("pantheon_token");
    if (!token) return;
    fetchStats();
    fetchLogs();
  }, [ready]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/audit/stats`);
      const data = await res.json();
      if (mountedRef.current) setStats(data);
    } catch (_) {}
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/audit/logs?limit=50`);
      const data = await res.json();
      if (mountedRef.current) setLogs(Array.isArray(data) ? data : (data.logs ?? []));
    } catch (_) {}
  };
  
  const handleLogout = () => {
    localStorage.removeItem("pantheon_token");
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    navigate("/login");
  };

  if (!ready) return <LoadingScreen status={loadingStatus} />;

  return (
    <Routes>
      <Route path="/" element={<LandingPage onEnter={() => navigate("/dashboard")} />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute ready={ready}>
            <Dashboard
              events={events}
              stats={stats}
              logs={logs}
              connected={connected}
              apiUrl={API_URL}
              onRefresh={() => { fetchStats(); fetchLogs(); }}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
