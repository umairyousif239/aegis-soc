![Alt Text](resources/logo/logo.gif)

> Built for the **Transforming Enterprise Through AI Hackathon** on [lablab.ai](https://lablab.ai/ai-hackathons/techex-intelligent-enterprise-solutions-hackathon)

**Pantheon** monitors, inspects, and red-teams enterprise AI agents in real time. Every message sent to an agent is routed through a deep-packet inspection proxy (Lobster Trap), scored for risk, and logged — giving security teams full visibility into what their AI agents are doing and why.

🌐 **Live demo:** [pantheon-ff9u.vercel.app](https://pantheon-ff9u.vercel.app)  
📧 **Demo account:** `demo@pantheon.ai` / `pantheon2025`

---

## Features

- **Live SOC Dashboard** — real-time event stream via WebSocket, 5 key security metrics, tabbed navigation
- **Agent Chat Panel** — interact directly with FinanceBot, MedBot, or DevBot; all traffic is inspected
- **Red Team Simulator** — fire 5 adversarial attack types against any agent; get an instant Gemini-powered threat analysis report
- **Threat Heatmap** — agent × attack-type grid colored by average risk score
- **Threat Timeline** — 12-hour bar chart of allowed vs. blocked interactions
- **Agent Health Scores** — live 0–100 security rating per agent with animated ring gauge
- **Threat Level Indicator** — pulsing LOW / ELEVATED / HIGH / CRITICAL badge in the header
- **Audit Log** — filterable, searchable table with natural-language querying (ask Gemini anything about the logs)
- **CSV Compliance Export** — one-click audit report download
- **Auth System** — signup, login, protected routes, demo account

---

## Tech Stack

| Layer | Tool |
|---|---|
| Agent LLM | Gemini 2.5 Flash |
| Security / DPI | Veea Lobster Trap (port 9000) |
| Backend | FastAPI (Python) |
| Frontend | React (Create React App) |
| Database | Turso (libsql, persistent cloud SQLite) |
| Deployment | Render (backend) + Vercel (frontend) |

---

## Architecture

```
Frontend (Vercel)
    ↓
FastAPI (Render :8000)
    ↓
Lobster Trap DPI Proxy (:9000)   ← all agent traffic inspected here
    ↓
Gemini 2.5 Flash
```

- All agent traffic is routed through Lobster Trap for deep-packet inspection
- Audit queries bypass Lobster Trap (direct Gemini call) to avoid false positives on stored attack patterns
- WebSocket at `/api/v1/ws` pushes live events to connected clients
- Turso persists audit logs and users across Render restarts

---

## Project Structure

```
Pantheon/
├── backend/
│   ├── main.py                  # FastAPI app, lifespan, CORS, routers
│   ├── state.py                 # Shared WebSocket client list
│   ├── routes/
│   │   ├── agents.py            # Agent chat endpoints
│   │   ├── audit.py             # Logs, stats, NL query, CSV export
│   │   ├── redteam.py           # Attack simulator + threat analysis
│   │   └── auth.py              # Login, signup, token verify
│   └── services/
│       ├── agents.py            # Agent pipeline (Lobster Trap → Gemini)
│       └── database.py          # Turso DB, all DB functions
└── frontend/src/
    ├── App.js                   # Routing, loading screen, WebSocket, auth
    └── components/
        ├── Dashboard.jsx        # Main SOC shell, tab routing
        ├── Header.jsx           # Logo, threat level badge, status
        ├── StatsBar.jsx         # 5 metric cards
        ├── LiveFeed.jsx         # Real-time event stream
        ├── AgentPanel.jsx       # Chat interface for 3 agents
        ├── RedTeam.jsx          # Attack simulator + Gemini analysis
        ├── AuditTable.jsx       # Filterable log table + NL query + CSV
        ├── ThreatHeatmap.jsx    # Agent × attack type risk grid
        ├── ThreatTimeline.jsx   # 12-hour activity bar chart
        ├── AgentHealth.jsx      # Per-agent health scores + ring gauges
        ├── LandingPage.jsx      # Marketing page with live stats
        └── PricingPage.jsx      # Outpost / Bastion / Citadel tiers
```

---

## API Routes

All routes prefixed with `/api/v1/`

| Method | Route | Description |
|---|---|---|
| GET | `/status` | Health check |
| POST | `/agents/{agent_id}/chat` | Chat with an agent |
| GET | `/audit/logs` | Fetch audit logs |
| GET | `/audit/stats` | Fetch aggregate stats |
| POST | `/audit/query` | Natural language log query (Gemini) |
| GET | `/audit/report/csv` | Export compliance CSV |
| GET | `/redteam/attacks` | List available attack types |
| POST | `/redteam/attack/{attack_id}` | Run a red team attack |
| POST | `/redteam/analyze` | Generate Gemini threat analysis |
| POST | `/auth/login` | Login |
| POST | `/auth/signup` | Signup |
| POST | `/auth/verify` | Verify token |
| WS | `/ws` | WebSocket live feed |

---

## Environment Variables

**Render (backend)**
```
GEMINI_API_KEY=...
LOBSTERTRAP_URL=http://localhost:9000
TURSO_DB_URL=libsql://pantheon-database-<username>.turso.io
TURSO_DB_TOKEN=...
```

**Vercel (frontend)**
```
REACT_APP_API_URL=https://pantheon-backend-fmnr.onrender.com
```

---

## Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm start
```

The frontend expects the backend at `http://localhost:8000` by default. Set `REACT_APP_API_URL` in a `.env` file to override.

Lobster Trap must be running on port 9000 for agent traffic inspection. See the [Lobster Trap repo](https://github.com/coal/lobstertrap) for setup instructions — the production Dockerfile builds it from source automatically.

---

## Database Schema

```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    reply TEXT NOT NULL,
    risk_score REAL DEFAULT 0,
    intent TEXT DEFAULT 'general',
    action TEXT DEFAULT 'ALLOW',
    blocked INTEGER DEFAULT 0,
    security_meta TEXT DEFAULT '{}'
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    token TEXT UNIQUE,
    created_at TEXT NOT NULL
);
```

---

## Red Team Attack Types

| Attack | Severity | Description |
|---|---|---|
| Prompt Injection | CRITICAL | Attempts to override agent system instructions |
| Data Exfiltration | HIGH | Attempts to extract and send sensitive data externally |
| Role Impersonation | HIGH | Attempts to impersonate an admin or privileged user |
| PII Extraction | MEDIUM | Attempts to extract personal identifiable information |
| Malware Request | CRITICAL | Attempts to generate malicious exfiltration scripts |

---

## Design System

**Fonts**

| Role | Font |
|---|---|
| Wordmark / Logo | Fraunces |
| Headlines / UI | Sora |
| Nav / Labels / Badges | DM Sans |
| Terminal / Logs / Mono | JetBrains Mono |

**Colors** — dark SOC theme (`#080c10` base) with cyan as the primary accent (`#39d0d8`). Full palette in `frontend/src/index.css`.

---

## How Pantheon Differentiates

Most agent monitoring tools inspect traffic passively via webhooks or only on report generation. Pantheon routes **all** agent traffic through Lobster Trap at the proxy level, meaning threats are caught before the agent responds — not after. The built-in red team simulator lets security teams actively probe their own agents rather than waiting for real attacks.

---

## License

MIT