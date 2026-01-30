#!/bin/bash
# Script para verificar el estado de salud de los servicios
# Uso: ./scripts/check-health.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verificando estado de salud del sistema SNIES...${NC}"
echo ""

# Check Docker
echo -n "Docker: "
if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    exit 1
fi

# Check containers
echo ""
echo "Contenedores:"
if docker-compose ps | grep -q "Up"; then
    docker-compose ps | grep "Up" | while read line; do
        container=$(echo $line | awk '{print $1}')
        echo -e "  ${GREEN}✓${NC} $container"
    done
else
    echo -e "  ${RED}✗ No hay contenedores corriendo${NC}"
    exit 1
fi

# Check database
echo ""
echo -n "PostgreSQL: "
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ready${NC}"
else
    echo -e "${RED}✗ Not ready${NC}"
fi

# Check backend
echo -n "Backend (Django): "
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${YELLOW}⚠ Not responding${NC}"
fi

# Check frontend
echo -n "Frontend (Next.js): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Responding${NC}"
else
    echo -e "${YELLOW}⚠ Not responding${NC}"
fi

# Check disk usage
echo ""
echo "Uso de disco (volúmenes Docker):"
docker system df -v | grep -A 10 "Local Volumes" | tail -n +2

echo ""
echo -e "${GREEN}✅ Verificación completada${NC}"
