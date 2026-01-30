#!/bin/bash
# Script para resetear y reconstruir el frontend

echo "🧹 Limpiando frontend..."

# Detener servicios
docker-compose down

# Eliminar contenedor del frontend
docker rm -f snies_frontend 2>/dev/null || true

# Eliminar imagen del frontend
docker rmi monorepo-frontend -f 2>/dev/null || true

# Limpiar volúmenes del frontend
docker volume rm monorepo_snies-frontend 2>/dev/null || true

# Limpiar cache local
rm -rf snies-frontend/.next 2>/dev/null || true

echo "✅ Limpieza completada"
echo ""
echo "🏗️  Reconstruyendo frontend..."

# Reconstruir sin cache
docker-compose build --no-cache frontend

echo "✅ Frontend reconstruido"
echo ""
echo "🚀 Levantando servicios..."

# Levantar todo
docker-compose up

echo ""
echo "✅ ¡Listo! Frontend funcionando sin reinicios"
