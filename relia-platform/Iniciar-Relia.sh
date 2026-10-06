#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo ""
echo "================================================================"
echo "   RELIA Platform - Roteiro Empático de Leitura com IA"
echo "   PhD CEHUM / Universidade do Minho"
echo "----------------------------------------------------------------"
echo "   App Aluno:     http://localhost:3000"
echo "   App Professor: http://localhost:3001"
echo "   FastAPI:       http://localhost:8000"
echo "   API Docs:      http://localhost:8000/docs"
echo "   MCP Server:    http://localhost:8001"
echo "================================================================"
echo ""

# Verificar pré-requisitos
command -v docker >/dev/null 2>&1 || { echo "[ERRO] Docker não encontrado. Instale em https://docker.com"; exit 1; }
docker compose version >/dev/null 2>&1 || { echo "[ERRO] Docker Compose V2 não encontrado."; exit 1; }

# Verificar .env
if [ ! -f ".env" ]; then
    echo "[AVISO] .env não encontrado. A copiar .env.example..."
    cp .env.example .env
    echo "        Preencha os valores em .env antes de continuar."
    read -p "Prima Enter para continuar..."
fi

# Iniciar serviços
echo "[INFO] A construir e iniciar os serviços..."
docker compose up -d --build

echo ""
echo "================================================================"
echo "  RELIA Platform está a correr!"
echo ""
echo "  App Aluno:     http://localhost:3000"
echo "  App Professor: http://localhost:3001"
echo "  FastAPI API:   http://localhost:8000/docs"
echo ""
echo "  Para ver logs: docker compose logs -f"
echo "  Para parar:    ./Parar-Relia.sh"
echo "================================================================"
echo ""
