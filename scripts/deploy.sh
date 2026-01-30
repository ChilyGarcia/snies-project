#!/bin/bash
# Script de deployment para producción
# Uso: ./scripts/deploy.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando deployment de SNIES en producción...${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
    echo -e "${YELLOW}Copia .env.production.example a .env y configura los valores${NC}"
    exit 1
fi

# Check required variables
echo -e "${BLUE}📋 Verificando variables de entorno...${NC}"
required_vars=("DB_NAME" "DB_USER" "DB_PASSWORD" "SECRET_KEY" "ALLOWED_HOSTS" "NEXT_PUBLIC_API_URL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=.*CAMBIAR" .env; then
        echo -e "${RED}❌ Error: Variable ${var} no está configurada correctamente${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✓ Variables de entorno verificadas${NC}"
echo ""

# Pull latest changes
echo -e "${BLUE}📥 Obteniendo últimos cambios...${NC}"
git pull origin main
echo -e "${GREEN}✓ Cambios obtenidos${NC}"
echo ""

# Build images
echo -e "${BLUE}🏗️  Construyendo imágenes Docker...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache
echo -e "${GREEN}✓ Imágenes construidas${NC}"
echo ""

# Stop old containers
echo -e "${BLUE}⏹️  Deteniendo contenedores antiguos...${NC}"
docker-compose -f docker-compose.prod.yml down
echo -e "${GREEN}✓ Contenedores detenidos${NC}"
echo ""

# Start new containers
echo -e "${BLUE}🚀 Iniciando nuevos contenedores...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✓ Contenedores iniciados${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}⏳ Esperando a que los servicios estén listos...${NC}"
sleep 15

# Run migrations
echo -e "${BLUE}🗄️  Ejecutando migraciones...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate --noinput
echo -e "${GREEN}✓ Migraciones aplicadas${NC}"
echo ""

# Collect static files
echo -e "${BLUE}📦 Recolectando archivos estáticos...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput
echo -e "${GREEN}✓ Archivos estáticos recolectados${NC}"
echo ""

# Check health
echo -e "${BLUE}🏥 Verificando estado de los servicios...${NC}"
sleep 5

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Servicios corriendo correctamente${NC}"
else
    echo -e "${RED}❌ Algunos servicios no están corriendo${NC}"
    docker-compose -f docker-compose.prod.yml ps
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📌 Tu aplicación está corriendo en:${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "Backend:  ${GREEN}http://$(hostname -I | awk '{print $1}')/api${NC}"
echo -e "Admin:    ${GREEN}http://$(hostname -I | awk '{print $1}')/admin${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo ""
echo "1. Crear superusuario (si es primera vez):"
echo -e "   ${YELLOW}docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser${NC}"
echo ""
echo "2. Ver logs:"
echo -e "   ${YELLOW}docker-compose -f docker-compose.prod.yml logs -f${NC}"
echo ""
echo "3. Configurar dominio y SSL (ver docs/DEPLOYMENT.md)"
echo ""
