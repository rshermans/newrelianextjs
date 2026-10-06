#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo ""
echo "================================================================"
echo "  RELIA Platform - A parar todos os serviços..."
echo "================================================================"
echo ""

docker compose down

echo ""
echo "[OK] Todos os serviços foram encerrados."
echo ""
