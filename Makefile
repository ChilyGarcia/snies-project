.PHONY: help install dev up down restart logs clean test lint format migrate shell

# Variables
DOCKER_COMPOSE = docker-compose
NPM = npm

# Colors for terminal output
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Muestra esta ayuda
	@echo "$(BLUE)SNIES Monorepo - Comandos Disponibles$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Instala todas las dependencias
	@echo "$(BLUE)Instalando dependencias del monorepo...$(NC)"
	$(NPM) install
	@echo "$(BLUE)Instalando dependencias del frontend...$(NC)"
	cd snies-frontend && $(NPM) install
	@echo "$(GREEN)✓ Dependencias instaladas$(NC)"

install-dev: ## Instala dependencias de desarrollo
	@echo "$(BLUE)Instalando dependencias de desarrollo...$(NC)"
	$(NPM) install
	cd snies-frontend && $(NPM) install
	cd snies-backend && pip install -r requirements-dev.txt
	@echo "$(GREEN)✓ Dependencias de desarrollo instaladas$(NC)"

dev: up ## Alias para 'make up'

up: ## Levanta todos los servicios con Docker
	@echo "$(BLUE)Levantando servicios...$(NC)"
	$(DOCKER_COMPOSE) up

up-bg: ## Levanta servicios en background
	@echo "$(BLUE)Levantando servicios en background...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✓ Servicios levantados$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:8000$(NC)"

down: ## Detiene y elimina los contenedores
	@echo "$(BLUE)Deteniendo servicios...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✓ Servicios detenidos$(NC)"

down-volumes: ## Detiene servicios y elimina volúmenes
	@echo "$(RED)Eliminando servicios y volúmenes...$(NC)"
	$(DOCKER_COMPOSE) down -v
	@echo "$(GREEN)✓ Servicios y volúmenes eliminados$(NC)"

restart: down up ## Reinicia todos los servicios

build: ## Construye las imágenes Docker
	@echo "$(BLUE)Construyendo imágenes...$(NC)"
	$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✓ Imágenes construidas$(NC)"

rebuild: ## Reconstruye las imágenes sin cache
	@echo "$(BLUE)Reconstruyendo imágenes...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✓ Imágenes reconstruidas$(NC)"

logs: ## Ver logs de todos los servicios
	$(DOCKER_COMPOSE) logs -f

logs-frontend: ## Ver logs del frontend
	$(DOCKER_COMPOSE) logs -f frontend

logs-backend: ## Ver logs del backend
	$(DOCKER_COMPOSE) logs -f backend

logs-db: ## Ver logs de la base de datos
	$(DOCKER_COMPOSE) logs -f db

ps: ## Lista los servicios en ejecución
	$(DOCKER_COMPOSE) ps

clean: ## Limpia archivos temporales y cache
	@echo "$(BLUE)Limpiando archivos temporales...$(NC)"
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .turbo 2>/dev/null || true
	@echo "$(GREEN)✓ Archivos temporales eliminados$(NC)"

test: ## Ejecuta todos los tests
	@echo "$(BLUE)Ejecutando tests...$(NC)"
	$(NPM) run test

test-frontend: ## Tests del frontend
	@echo "$(BLUE)Ejecutando tests del frontend...$(NC)"
	cd snies-frontend && $(NPM) test

test-backend: ## Tests del backend
	@echo "$(BLUE)Ejecutando tests del backend...$(NC)"
	$(DOCKER_COMPOSE) exec backend pytest

test-backend-local: ## Tests del backend (sin Docker)
	@echo "$(BLUE)Ejecutando tests del backend localmente...$(NC)"
	cd snies-backend && pytest

lint: ## Ejecuta linters en todo el proyecto
	@echo "$(BLUE)Ejecutando linters...$(NC)"
	$(NPM) run lint

lint-frontend: ## Lint del frontend
	@echo "$(BLUE)Linting frontend...$(NC)"
	cd snies-frontend && $(NPM) run lint

lint-backend: ## Lint del backend
	@echo "$(BLUE)Linting backend...$(NC)"
	cd snies-backend && black --check . && isort --check-only . && flake8 .

format: ## Formatea todo el código
	@echo "$(BLUE)Formateando código...$(NC)"
	$(NPM) run format
	@echo "$(GREEN)✓ Código formateado$(NC)"

format-frontend: ## Formatea el frontend
	cd snies-frontend && npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"

format-backend: ## Formatea el backend
	cd snies-backend && black . && isort .

type-check: ## Verifica tipos TypeScript
	@echo "$(BLUE)Verificando tipos...$(NC)"
	cd snies-frontend && npx tsc --noEmit
	@echo "$(GREEN)✓ Tipos verificados$(NC)"

migrate: ## Ejecuta migraciones de Django
	@echo "$(BLUE)Ejecutando migraciones...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py migrate
	@echo "$(GREEN)✓ Migraciones aplicadas$(NC)"

makemigrations: ## Crea nuevas migraciones
	@echo "$(BLUE)Creando migraciones...$(NC)"
	$(DOCKER_COMPOSE) exec backend python manage.py makemigrations
	@echo "$(GREEN)✓ Migraciones creadas$(NC)"

shell: ## Abre el shell de Django
	$(DOCKER_COMPOSE) exec backend python manage.py shell

dbshell: ## Abre el shell de PostgreSQL
	$(DOCKER_COMPOSE) exec db psql -U postgres -d snies_db

createsuperuser: ## Crea un superusuario de Django
	$(DOCKER_COMPOSE) exec backend python manage.py createsuperuser

collectstatic: ## Recolecta archivos estáticos
	$(DOCKER_COMPOSE) exec backend python manage.py collectstatic --noinput

backup-db: ## Hace backup de la base de datos
	@echo "$(BLUE)Creando backup de la base de datos...$(NC)"
	$(DOCKER_COMPOSE) exec db pg_dump -U postgres snies_db > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup creado$(NC)"

restore-db: ## Restaura la base de datos (uso: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)Restaurando base de datos desde $(FILE)...$(NC)"
	$(DOCKER_COMPOSE) exec -T db psql -U postgres snies_db < $(FILE)
	@echo "$(GREEN)✓ Base de datos restaurada$(NC)"

setup: install-dev up-bg migrate ## Setup inicial del proyecto
	@echo "$(GREEN)✓ Proyecto configurado$(NC)"
	@echo "$(YELLOW)No olvides crear un superusuario: make createsuperuser$(NC)"

update: ## Actualiza dependencias
	@echo "$(BLUE)Actualizando dependencias...$(NC)"
	git pull
	$(NPM) install
	cd snies-frontend && $(NPM) install
	$(DOCKER_COMPOSE) exec backend pip install -r requirements.txt
	make migrate
	@echo "$(GREEN)✓ Proyecto actualizado$(NC)"
