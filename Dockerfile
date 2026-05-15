# Stage 1: Build Lobster Trap binary
FROM golang:1.22-alpine AS lobster-builder
RUN apk add --no-cache git make
WORKDIR /build
RUN git clone https://github.com/coal/lobstertrap.git .
RUN make build

# Stage 2: Final image
FROM python:3.11-slim
WORKDIR /app

# Copy Lobster Trap binary and config
COPY --from=lobster-builder /build/lobstertrap /app/lobstertrap/lobstertrap
COPY --from=lobster-builder /build/configs/ /app/lobstertrap/configs/

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend + data dir
COPY backend/ ./backend/
COPY data/ ./data/

# Startup script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 8000

CMD ["./start.sh"]