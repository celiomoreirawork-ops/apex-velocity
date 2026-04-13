@echo off
TITLE Apex Velocity - Gerenciador de Inicializacao
color 0b

echo ==========================================
echo       INICIANDO APEX VELOCITY
echo ==========================================
echo.

:: 1. Inicia o Backend em uma nova janela minimizada
echo [1/2] Ligando Servidor Backend (Google Sheets API)...
start "Apex Backend" /min cmd /c "cd /d %~dp0server && node index.js"

:: 2. Inicia o Frontend na janela atual
echo [2/2] Ligando Interface Frontend (Vite)...
echo.
echo O navegador abrira automaticamente em instantes...
echo.
npm run dev

pause
