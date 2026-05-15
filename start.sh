#!/bin/bash
set -e

# Start Lobster Trap in background on port 9000
./lobstertrap/lobstertrap serve \
  --listen :9000 \
  --backend https://generativelanguage.googleapis.com \
  --policy ./lobstertrap/configs/default_policy.yaml \
  --no-dashboard &

echo "Lobster Trap started on :9000"

# Give it a moment to start
sleep 2

# Start FastAPI on $PORT (provided by Render)
exec uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
