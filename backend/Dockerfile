# =========================
# Builder stage
# =========================
FROM python:3.13-slim AS builder

WORKDIR /app

# 1. Cache untuk APT (System Packages)
# Kita menggunakan cache mount untuk folder cache apt agar tidak download index berkali-kali
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
    && pip install --upgrade pip

# 2. Cache untuk PIP (Python Packages)
# Pastikan COPY requirements dilakukan SEBELUM install agar layer caching bekerja
COPY ./backend/requirements-prod.txt ./

# Menggunakan cache mount khusus pip agar tidak download ulang .whl files
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements-prod.txt

# =========================
# Runtime stage
# =========================
FROM python:3.13-slim AS runtime

WORKDIR /app

# Copy hasil instalasi dari builder
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY ./backend/app ./app
COPY ./backend/scripts ./scripts
COPY ./backend/migration ./migration
COPY ./backend/alembic.ini ./
COPY ./backend/data.sql ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]