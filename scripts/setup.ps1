# Script de setup inicial del monorepo SNIES para Windows PowerShell
# Uso: .\scripts\setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando setup del monorepo SNIES..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✓ Docker está instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    Write-Host "Por favor instala Docker desde: https://www.docker.com/get-started"
    exit 1
}

try {
    docker-compose --version | Out-Null
    Write-Host "✓ Docker Compose está instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion está instalado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Node.js no está instalado (opcional para desarrollo)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Paso 1: Configurando variables de entorno..." -ForegroundColor Cyan

# Copy .env.example to .env if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ Archivo .env creado" -ForegroundColor Green
    Write-Host "⚠️  Por favor edita .env con tus configuraciones" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  El archivo .env ya existe" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Paso 2: Instalando dependencias del monorepo..." -ForegroundColor Cyan

try {
    npm install
    Write-Host "✓ Dependencias del monorepo instaladas" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📦 Paso 3: Instalando dependencias del frontend..." -ForegroundColor Cyan
    Push-Location snies-frontend
    npm install
    Pop-Location
    Write-Host "✓ Dependencias del frontend instaladas" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error instalando dependencias" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🐳 Paso 4: Construyendo imágenes Docker..." -ForegroundColor Cyan
docker-compose build
Write-Host "✓ Imágenes Docker construidas" -ForegroundColor Green

Write-Host ""
Write-Host "🐳 Paso 5: Iniciando servicios..." -ForegroundColor Cyan
docker-compose up -d
Write-Host "✓ Servicios iniciados" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ Esperando a que los servicios estén listos..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🗄️  Paso 6: Ejecutando migraciones..." -ForegroundColor Cyan
docker-compose exec backend python manage.py migrate
Write-Host "✓ Migraciones aplicadas" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "📌 Información importante:" -ForegroundColor Blue
Write-Host ""
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Admin:    http://localhost:8000/admin" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Crear un superusuario para Django:"
Write-Host "   docker-compose exec backend python manage.py createsuperuser" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Ver logs:"
Write-Host "   docker-compose logs -f" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Detener servicios:"
Write-Host "   docker-compose down" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para más información, consulta el README.md"
Write-Host ""
