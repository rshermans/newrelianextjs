@echo off
setlocal
chcp 65001 >nul
title RELIA Platform - A encerrar
color 0C

cd /d "%~dp0"

echo.
echo ================================================================
echo   RELIA Platform - A parar todos os servicos...
echo ================================================================
echo.

docker compose down

if %errorlevel% equ 0 (
    echo.
    echo [OK] Todos os servicos foram encerrados com sucesso.
) else (
    echo.
    echo [AVISO] Alguns servicos podem nao ter parado correctamente.
    echo         Execute: docker compose down --remove-orphans
)

echo.
timeout /t 3 /nobreak >nul
