import aiosqlite
import json
import os
from datetime import datetime, UTC

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "data/aegis.db")

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
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
        await db.commit()

async def log_interaction(agent_id, user_id, message, reply, security_meta={}):
    ingress = security_meta.get("ingress", {})
    detected = ingress.get("detected", {})
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
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
        await db.commit()

async def get_audit_logs(limit=100):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,)
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

async def get_stats():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("""
            SELECT
                COUNT(*) as total,
                SUM(blocked) as total,
                AVG(risk_score) as avg_risk,
                COUNT(DISTINCT agent_id) as active_agents
            FROM audit_logs
        """) as cursor:
            row = await cursor.fetchone()
            return dict(row)