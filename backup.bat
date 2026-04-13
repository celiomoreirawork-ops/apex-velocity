@echo off
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"
set TIMESTAMP=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo [Backup] Iniciando backup automatico do Apex Velocity...

%GIT_PATH% add .
%GIT_PATH% commit -m "auto-backup %TIMESTAMP%"

if %ERRORLEVEL% EQU 0 (
    echo [Sucesso] Backup realizado em %TIMESTAMP%
) else (
    echo [Aviso] Nenhuma alteração detectada ou erro no processo.
)

pause
