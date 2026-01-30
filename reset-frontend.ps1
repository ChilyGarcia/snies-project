# Script para resetear y reconstruir el frontend (Windows PowerShell)

Write-Host "🧹 Limpiando frontend..." -ForegroundColor Cyan

# Detener servicios
docker-compose down

# Eliminar contenedor del frontend
docker rm -f snies_frontend 2>$null

# Eliminar imagen del frontend
docker rmi monorepo-frontend -f 2>$null

# Eliminar volúmenes
docker volume rm monorepo_snies-frontend 2>$null

# Limpiar cache local
if (Test-Path "snies-frontend\.next") {
    Remove-Item -Recurse -Force "snies-frontend\.next"
}

Write-Host "✅ Limpieza completada" -ForegroundColor Green
Write-Host ""
Write-Host "🏗️  Reconstruyendo frontend..." -ForegroundColor Cyan

# Reconstruir sin cache
docker-compose build --no-cache frontend

Write-Host "✅ Frontend reconstruido" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Levantando servicios..." -ForegroundColor Cyan

# Levantar todo
docker-compose up

Write-Host ""
Write-Host "✅ ¡Listo! Frontend funcionando sin reinicios" -ForegroundColor Green
