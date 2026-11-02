@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for UrbanFix Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "MAVEN_EMBEDDED=%SCRIPT_DIR%.tools\apache-maven-3.9.9\bin\mvn.cmd"

if exist "%MAVEN_EMBEDDED%" (
    call "%MAVEN_EMBEDDED%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please ensure Java and Maven are available.
exit /b 1
