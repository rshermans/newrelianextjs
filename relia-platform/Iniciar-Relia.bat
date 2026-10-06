@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title RELIA Platform - Ecossistema de Mediacao Leitora
color 0A

REM Garantir que o directorio de trabalho e o directorio do script
cd /d "%~dp0"

echo.
echo ================================================================
echo    RELIA Platform - Roteiro Empatico de Leitura com IA
echo    PhD CEHUM / Universidade do Minho
echo ----------------------------------------------------------------
echo    App Aluno:     http://localhost:3000
echo    App Professor: http://localhost:3001
echo    FastAPI:       http://localhost:8000
echo    API Docs:      http://localhost:8000/docs
echo    MCP Server:    http://localhost:8001
echo ================================================================
echo.

REM --------------------------------------------------------
REM 1. Verificar pre-requisitos
REM --------------------------------------------------------
echo [INFO] A verificar pre-requisitos...

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado no PATH do sistema.
    echo        Instale Docker Desktop de https://docker.com
    pause
    exit /b 1
)
echo   - Docker: OK

docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Compose nao encontrado.
    echo        Atualize o Docker Desktop para incluir o Compose V2.
    pause
    exit /b 1
)
echo   - Docker Compose: OK

REM --------------------------------------------------------
REM 2. Verificar ficheiro .env
REM --------------------------------------------------------
if not exist ".env" (
    echo.
    echo [AVISO] Ficheiro .env nao encontrado.
    echo         A copiar .env.example para .env...
    copy ".env.example" ".env" >nul
    echo         Preencha os valores em .env antes de continuar.
    echo.
    pause
)

REM --------------------------------------------------------
REM 3. Iniciar servicos com Docker Compose
REM --------------------------------------------------------
echo.
echo [INFO] A construir e iniciar os servicos...
echo.
docker compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao iniciar os servicos.
    echo        Verifique os logs: docker compose logs
    pause
    exit /b 1
)

REM --------------------------------------------------------
REM 4. Aguardar servicos ficarem prontos
REM --------------------------------------------------------
echo.
echo [INFO] A aguardar que os servicos fiquem prontos...

set READY=0
for /l %%i in (1,1,30) do (
    if !READY! equ 0 (
        timeout /t 2 /nobreak >nul
        docker compose ps --format "{{.Status}}" 2>nul | findstr /i "healthy" >nul
        if !errorlevel! equ 0 (
            set READY=1
        )
    )
)

echo.
echo ================================================================
echo   RELIA Platform esta a correr!
echo.
echo   App Aluno:     http://localhost:3000
echo   App Professor: http://localhost:3001
echo   FastAPI API:   http://localhost:8000/docs
echo   MCP Server:    http://localhost:8001
echo.
echo   Para ver logs: docker compose logs -f
echo   Para parar:    execute Parar-Relia.bat
echo ================================================================
echo.

REM --------------------------------------------------------
REM 5. Abrir browsers
REM --------------------------------------------------------
start "" http://localhost:3000
timeout /t 1 /nobreak >nul
start "" http://localhost:3001

echo Prima qualquer tecla para fechar esta janela...
echo (Os servicos continuam a correr em segundo plano)
pause >nul
