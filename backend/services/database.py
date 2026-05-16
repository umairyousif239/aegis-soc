import libsql_experimental as libsql
import json
import os
import secrets
import bcrypt
from datetime import datetime, UTC

from backend.state import connected_clients

DB_URL = os.getenv("TURSO_DB_URL")
DB_TOKEN = os.getenv("TURSO_DB_TOKEN")

def get_conn():
    return libsql.connect(DB_URL, auth_token=DB_TOKEN)

def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
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
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            token TEXT UNIQUE,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()

    # Seed demo account if it doesn't exist
    result = conn.execute("SELECT id FROM users WHERE email = ?", ("demo@pantheon.ai",))
    if not result.fetchone():
        password_hash = bcrypt.hashpw(b"pantheon2025", bcrypt.gensalt()).decode()
        token = secrets.token_urlsafe(32)
        conn.execute("""
            INSERT INTO users (email, password_hash, token, created_at)
            VALUES (?, ?, ?, ?)
        """, ("demo@pantheon.ai", password_hash, token, datetime.now(UTC).isoformat()))
        conn.commit()

def create_user(email, password):
    conn = get_conn()
    result = conn.execute("SELECT id FROM users WHERE email = ?", (email,))
    if result.fetchone():
        return None, "Email already registered"
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    token = secrets.token_urlsafe(32)
    conn.execute("""
        INSERT INTO users (email, password_hash, token, created_at)
        VALUES (?, ?, ?, ?)
    """, (email, password_hash, token, datetime.now(UTC).isoformat()))
    conn.commit()
    return token, None

def login_user(email, password):
    conn = get_conn()
    result = conn.execute(
        "SELECT password_hash, token FROM users WHERE email = ?", (email,)
    )
    row = result.fetchone()
    if not row:
        return None, "Invalid email or password"
    password_hash, token = row
    if not bcrypt.checkpw(password.encode(), password_hash.encode()):
        return None, "Invalid email or password"
    return token, None

def verify_token(token):
    conn = get_conn()
    result = conn.execute(
        "SELECT id, email FROM users WHERE token = ?", (token,)
    )
    row = result.fetchone()
    if not row:
        return None
    return {"id": row[0], "email": row[1]}

async def broadcast_event(event: dict):
    dead = []
    for client in connected_clients:
        try:
            await client.send_text(json.dumps(event))
        except Exception:
            dead.append(client)
    for d in dead:
        connected_clients.remove(d)

async def log_interaction(agent_id, user_id, message, reply, security_meta={}):
    ingress = security_meta.get("ingress", {})
    detected = ingress.get("detected", {})
    conn = get_conn()
    conn.execute("""
        INSERT INTO audit_logs
        (timestamp, agent_id, user_id, message, reply, risk_score, intent, action, blocked, security_meta)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now(UTC).isoformat(),
        agent_id,
        user_id,
        message,
        reply,
        detected.get("risk_score", 0),
        detected.get("intent_category", "general"),
        security_meta.get("verdict", "ALLOW"),
        1 if security_meta.get("verdict") == "DENY" else 0,
        json.dumps(security_meta)
    ))
    conn.commit()
    await broadcast_event({
        "type": "new_interaction",
        "agent_id": agent_id,
        "verdict": security_meta.get("verdict", "ALLOW"),
        "risk_score": detected.get("risk_score", 0),
        "intent": detected.get("intent_category", "general"),
        "blocked": 1 if security_meta.get("verdict") == "DENY" else 0,
        "timestamp": datetime.now(UTC).isoformat()
    })

def get_audit_logs(limit=100):
    conn = get_conn()
    result = conn.execute(
        "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,)
    )
    rows = result.fetchall()
    cols = [d[0] for d in result.description]
    return [dict(zip(cols, row)) for row in rows]

def get_stats():
    conn = get_conn()
    result = conn.execute("""
        SELECT
            COUNT(*) as total,
            SUM(blocked) as blocked,
            AVG(risk_score) as avg_risk,
            COUNT(DISTINCT agent_id) as active_agents
        FROM audit_logs
    """)
    row = result.fetchone()
    cols = [d[0] for d in result.description]
    return dict(zip(cols, row))