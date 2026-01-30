#!/bin/bash
# Script de setup inicial del monorepo SNIES
# Uso: ./scripts/setup.sh

set -e

echo "🚀 Iniciando setup del monorepo SNIES..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Por favor instala Docker desde: https://www.docker.com/get-started"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo "Por favor instala Docker Compose"
    exit 1
fi

echo -e "${GREEN}✓ Docker y Docker Compose están instalados${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado (opcional para desarrollo)${NC}"
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION está instalado${NC}"
fi

echo ""
echo "📦 Paso 1: Configurando variables de entorno..."

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️  Por favor edita .env con tus configuraciones${NC}"
else
    echo -e "${YELLOW}⚠️  El archivo .env ya existe${NC}"
fi

echo ""
echo "📦 Paso 2: Instalando dependencias del monorepo..."

if command -v npm &> /dev/null; then
    npm install
    echo -e "${GREEN}✓ Dependencias del monorepo instaladas${NC}"
    
    echo ""
    echo "📦 Paso 3: Instalando dependencias del frontend..."
    cd snies-frontend
    npm install
    cd ..
    echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Saltando instalación de dependencias (Node.js no disponible)${NC}"
fi

echo ""
echo "🐳 Paso 4: Construyendo imágenes Docker..."
docker-compose build
echo -e "${GREEN}✓ Imágenes Docker construidas${NC}"

echo ""
echo "🐳 Paso 5: Iniciando servicios..."
docker-compose up -d
echo -e "${GREEN}✓ Servicios iniciados${NC}"

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

echo ""
echo "🗄️  Paso 6: Ejecutando migraciones..."
docker-compose exec backend python manage.py migrate
echo -e "${GREEN}✓ Migraciones aplicadas${NC}"

echo ""
echo -e "${GREEN}✅ Setup completado!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📌 Información importante:${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "Admin:    ${GREEN}http://localhost:8000/admin${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "1. Crear un superusuario para Django:"
echo -e "   ${YELLOW}docker-compose exec backend python manage.py createsuperuser${NC}"
echo ""
echo "2. Ver logs:"
echo -e "   ${YELLOW}docker-compose logs -f${NC}"
echo ""
echo "3. Detener servicios:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
echo "Para más información, consulta el README.md"
echo ""
