# 🎓 Sistema SNIES - FESC

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-green)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

Sistema integral de gestión SNIES (Sistema Nacional de Información de la Educación Superior) para la **Fundación de Estudios Superiores Comfanorte (FESC)**.

Monorepo moderno que integra frontend (Next.js) y backend (Django) con arquitectura hexagonal, siguiendo las mejores prácticas de la industria.

---

## 📖 Tabla de Contenidos

- [Características](#-características-principales)
- [Tecnologías](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Prerequisitos](#-prerequisitos)
- [Inicio Rápido](#-inicio-rápido)
- [Documentación](#-documentación)
- [Despliegue](#-despliegue-en-producción)
- [Scripts](#-scripts-disponibles)
- [Estructura](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Soporte](#-soporte)

---

## ✨ Características Principales

### Módulos del Sistema

- 🎓 **Gestión de Cursos** - Administración completa de programas académicos
- 👥 **Gestión de Usuarios** - Sistema de autenticación y autorización con JWT
- 💻 **Actividades de Software** - Registro y seguimiento de proyectos tecnológicos
- 🌱 **Bienestar Institucional** - Programas de bienestar estudiantil
- 📚 **Educación Continuada** - Gestión de cursos de extensión
- 👨‍🏫 **Recursos Humanos** - Administración de personal docente
- 📊 **Reportes y Analytics** - Dashboards interactivos con gráficos
- 📈 **Exportación de Datos** - Generación de reportes en Excel

### Características Técnicas

- ✅ **Arquitectura Hexagonal** en backend (Clean Architecture)
- ✅ **Arquitectura Modular** en frontend por dominio
- ✅ **API REST** con Django REST Framework
- ✅ **SSR y CSR** con Next.js App Router
- ✅ **Autenticación JWT** segura
- ✅ **UI Moderna** con Tailwind CSS y shadcn/ui
- ✅ **Validación de Formularios** con React Hook Form + Zod
- ✅ **Docker Compose** para desarrollo y producción
- ✅ **CI/CD** con GitHub Actions
- ✅ **Git Hooks** automatizados con Husky
- ✅ **Monorepo Management** con Turborepo
- ✅ **Hot Reload** en desarrollo
- ✅ **TypeScript** estricto
- ✅ **Code Quality** con ESLint, Prettier, Black, Flake8

---

## 🚀 Stack Tecnológico

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 16+ | React framework con SSR/SSG |
| [TypeScript](https://www.typescriptlang.org/) | 5+ | Superset tipado de JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4+ | Framework de utilidades CSS |
| [shadcn/ui](https://ui.shadcn.com/) | Latest | Componentes UI reutilizables |
| [React Hook Form](https://react-hook-form.com/) | 7+ | Gestión de formularios |
| [Zod](https://zod.dev/) | 3+ | Validación de esquemas |
| [Recharts](https://recharts.org/) | 2+ | Librería de gráficos |
| [Lucide Icons](https://lucide.dev/) | Latest | Iconos modernos |
| [Framer Motion](https://www.framer.com/motion/) | 12+ | Animaciones |

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| [Django](https://www.djangoproject.com/) | 4.2 | Framework web Python |
| [Django REST Framework](https://www.django-rest-framework.org/) | 3+ | API REST toolkit |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Base de datos relacional |
| [Gunicorn](https://gunicorn.org/) | 21+ | WSGI HTTP Server |
| [JWT](https://jwt.io/) | Latest | Autenticación con tokens |
| [Django CORS Headers](https://github.com/adamchainz/django-cors-headers) | 4+ | Manejo de CORS |

### DevOps & Tools

| Herramienta | Propósito |
|-------------|-----------|
| [Docker](https://www.docker.com/) | Containerización |
| [Docker Compose](https://docs.docker.com/compose/) | Orquestación multi-contenedor |
| [Nginx](https://nginx.org/) | Reverse proxy y servidor web |
| [Turborepo](https://turbo.build/) | Build system para monorepos |
| [Husky](https://typicode.github.io/husky/) | Git hooks |
| [ESLint](https://eslint.org/) | Linter JavaScript/TypeScript |
| [Prettier](https://prettier.io/) | Formateador de código |
| [Black](https://black.readthedocs.io/) | Formateador Python |
| [Pytest](https://pytest.org/) | Testing framework Python |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |

---

## 🏛️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                  Internet / Usuarios                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS/HTTP
                       ▼
┌──────────────────────────────────────────────────────┐
│              Nginx (Reverse Proxy)                   │
│  - SSL/TLS Termination                               │
│  - Load Balancing                                    │
│  - Static Files Serving                              │
│  - Gzip Compression                                  │
└────────┬─────────────────────────────────┬───────────┘
         │                                 │
         │ /api, /admin                    │ /, /_next
         ▼                                 ▼
┌─────────────────────┐         ┌──────────────────────┐
│   Backend Django    │         │   Frontend Next.js   │
│                     │         │                      │
│  ┌──────────────┐   │         │  ┌────────────────┐ │
│  │Presentation  │   │         │  │  Presentation  │ │
│  │   (API)      │   │         │  │  (Components)  │ │
│  └──────┬───────┘   │         │  └────────┬───────┘ │
│         │           │         │           │         │
│  ┌──────▼───────┐   │         │  ┌────────▼───────┐ │
│  │ Application  │   │         │  │  Application   │ │
│  │ (Use Cases)  │   │         │  │   (Hooks)      │ │
│  └──────┬───────┘   │         │  └────────┬───────┘ │
│         │           │         │           │         │
│  ┌──────▼───────┐   │         │  ┌────────▼───────┐ │
│  │   Domain     │   │         │  │Infrastructure  │ │
│  │  (Business)  │   │         │  │   (API Calls)  │ │
│  └──────┬───────┘   │         │  └────────────────┘ │
│         │           │         │                      │
│  ┌──────▼───────┐   │         └──────────────────────┘
│  │Infrastructure│   │
│  │  (Database)  │   │
│  └──────┬───────┘   │
└─────────┼───────────┘
          │
          ▼
┌──────────────────────┐
│   PostgreSQL 16      │
│                      │
│  - Persistent Data   │
│  - Transactions      │
│  - Indexes           │
└──────────────────────┘
```

### Backend - Arquitectura Hexagonal (Puertos y Adaptadores)

```
module_name/
├── domain/              # 🎯 NÚCLEO - Lógica de negocio pura
│   ├── entities/        # Entidades del dominio
│   ├── repositories/    # Interfaces (puertos)
│   ├── services/        # Servicios de dominio
│   └── exceptions.py    # Excepciones de negocio
│
├── application/         # 📋 CASOS DE USO
│   └── use_cases/       # Orquestación de lógica
│
├── infrastructure/      # 🔌 ADAPTADORES
│   └── persistence/
│       └── django/      # Implementación con Django ORM
│
└── presentation/        # 🌐 API REST
    └── api/             # Serializers, Views, URLs
```

**Flujo de una Request:**
```
HTTP Request → View → Use Case → Domain Service → Repository → Database
                                                                    ↓
HTTP Response ← Serializer ← Use Case ← Domain Service ← Repository ←
```

### Frontend - Arquitectura por Módulos

```
modules/
└── module_name/
    ├── domain/          # 📐 Tipos e Interfaces
    │   └── types.ts
    ├── application/     # 🎮 Lógica de Negocio
    │   └── hooks/
    ├── infrastructure/  # 🔧 Servicios Externos
    │   └── api/
    └── presentation/    # 🎨 Componentes UI
        └── components/
```

---

## 📋 Prerequisitos

### Para Desarrollo

#### Opción 1: Con Docker (Recomendado) ⭐

- [Docker](https://www.docker.com/get-started) 24+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.20+
- [Node.js](https://nodejs.org/) 18+ (para scripts del monorepo)
- [Git](https://git-scm.com/)

#### Opción 2: Sin Docker

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- [PostgreSQL](https://www.postgresql.org/) 16+
- [Git](https://git-scm.com/)

### Para Producción

Ver **[INFRASTRUCTURE_GUIDE.md](./INFRASTRUCTURE_GUIDE.md)** para requisitos de VPS.

---

## 🏃 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Monorepo

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Instalar dependencias del monorepo
npm install

# 4. Levantar todos los servicios
npm run docker:up

# 5. En otra terminal, crear superusuario
npm run createsuperuser
```

**¡Listo!** Acceder a:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Django**: http://localhost:8000/admin

### Opción 2: Sin Docker (Manual)

<details>
<summary>Expandir para ver instrucciones detalladas</summary>

#### Backend

```bash
# 1. Crear base de datos PostgreSQL
createdb snies_db

# 2. Configurar backend
cd snies-backend
cp .env.example .env
# Editar .env con credenciales de PostgreSQL

# 3. Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Ejecutar migraciones
python manage.py migrate

# 6. Crear superusuario
python manage.py createsuperuser

# 7. Iniciar servidor
python manage.py runserver
```

#### Frontend

```bash
# En otra terminal

# 1. Configurar frontend
cd snies-frontend
cp env.local.example .env.local

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

</details>

### Verificar Instalación

- ✅ Frontend corriendo en http://localhost:3000
- ✅ Backend corriendo en http://localhost:8000
- ✅ Puedes hacer login en http://localhost:8000/admin

---

## 📚 Documentación

### Para Desarrolladores

| Documento | Descripción |
|-----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Guía de inicio rápido |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guía de contribución |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitectura del sistema |
| [WHATS_NEW.md](./WHATS_NEW.md) | Mejoras implementadas |

### Para DevOps / Infraestructura

| Documento | Descripción |
|-----------|-------------|
| [INFRASTRUCTURE_GUIDE.md](./INFRASTRUCTURE_GUIDE.md) ⭐ | **Guía paso a paso para deployment** |
| [README_PRODUCTION.md](./README_PRODUCTION.md) | Guía rápida de producción |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Deployment detallado |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Checklist pre-deployment |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Resumen de deployment |

### Otros

| Documento | Descripción |
|-----------|-------------|
| [CHANGELOG.md](./CHANGELOG.md) | Historial de cambios |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Checklist de configuración |

---

## 🚀 Despliegue en Producción

### Para DevOps

La forma más rápida de desplegar en un VPS:

```bash
# En el servidor VPS:
cd /opt
git clone <repo-url> snies
cd snies
cp .env.production.example .env
nano .env  # Configurar variables críticas
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Tiempo:** ~30 minutos

### Documentación Completa

📖 **Lee primero**: [INFRASTRUCTURE_GUIDE.md](./INFRASTRUCTURE_GUIDE.md) 

Esta guía incluye:
- ✅ Preparación del servidor
- ✅ Instalación de Docker
- ✅ Configuración de variables
- ✅ Deployment automatizado
- ✅ Configuración de SSL
- ✅ Backups
- ✅ Monitoreo
- ✅ Troubleshooting

### Archivos de Producción

El monorepo incluye configuración completa para producción:

| Archivo | Descripción |
|---------|-------------|
| `docker-compose.prod.yml` | Orquestación de producción |
| `Dockerfile.frontend.prod` | Frontend optimizado (multi-stage) |
| `Dockerfile.backend.prod` | Backend con Gunicorn |
| `nginx/prod.conf` | Configuración Nginx |
| `.env.production.example` | Template de variables |
| `scripts/deploy.sh` | Script de deployment automatizado |

### Requisitos del VPS

- Ubuntu 22.04+ / Debian 11+
- 2GB+ RAM (recomendado 4GB+)
- 20GB+ disco
- Docker y Docker Compose instalados

---

## 📜 Scripts Disponibles

### Gestión del Monorepo

```bash
npm run dev              # Inicia todos los servicios con Docker
npm run install:all      # Instala todas las dependencias
npm run clean            # Limpia archivos temporales
npm run lint             # Ejecuta linters
npm run format           # Formatea código
npm run test             # Ejecuta todos los tests
npm run type-check       # Verifica tipos TypeScript
```

### Docker (Desarrollo)

```bash
npm run docker:up        # Levanta contenedores en foreground
npm run docker:up:bg     # Levanta contenedores en background
npm run docker:down      # Detiene y elimina contenedores
npm run docker:restart   # Reinicia todos los servicios
npm run docker:build     # Construye imágenes
npm run docker:logs      # Ver logs de todos los servicios
npm run docker:logs:frontend  # Ver logs del frontend
npm run docker:logs:backend   # Ver logs del backend
npm run docker:logs:db        # Ver logs de PostgreSQL
```

### Producción

```bash
npm run prod:deploy      # Ejecuta deployment de producción
npm run prod:up          # Inicia servicios de producción
npm run prod:down        # Detiene servicios de producción
npm run prod:logs        # Ver logs de producción
npm run prod:ps          # Ver estado de servicios
```

### Base de Datos

```bash
npm run migrate          # Ejecutar migraciones
npm run makemigrations   # Crear nuevas migraciones
npm run shell            # Django shell
npm run dbshell          # PostgreSQL shell
npm run createsuperuser  # Crear superusuario
npm run collectstatic    # Recolectar archivos estáticos
```

### Frontend (sin Docker)

```bash
npm run dev:frontend     # Desarrollo local
npm run build:frontend   # Build de producción
npm run lint:frontend    # Linter
```

### Backend (sin Docker)

```bash
npm run dev:backend      # Desarrollo local
npm run test:backend     # Tests
npm run format:backend   # Formatear código Python
```

### Makefile (Alternativo)

```bash
make help        # Ver todos los comandos
make up          # Iniciar servicios
make down        # Detener servicios
make logs        # Ver logs
make migrate     # Ejecutar migraciones
make test        # Ejecutar tests
make clean       # Limpiar archivos temporales
make backup-db   # Backup de base de datos
```

---

## 📁 Estructura del Proyecto

```
Monorepo/
├── 📄 README.md                    # Este archivo
├── 📄 package.json                 # Gestión del monorepo
├── 📄 turbo.json                   # Configuración Turborepo
├── 📄 Makefile                     # Comandos útiles
│
├── 📄 docker-compose.yml           # Docker para desarrollo
├── 📄 docker-compose.prod.yml     # Docker para producción
├── 📄 Dockerfile.frontend.prod    # Frontend optimizado
├── 📄 Dockerfile.backend.prod     # Backend optimizado
│
├── 📄 .env.example                # Variables de desarrollo
├── 📄 .env.production.example     # Variables de producción
├── 📄 .gitignore                  # Git ignore global
├── 📄 .editorconfig               # Configuración de editor
│
├── .husky/                        # Git hooks
│   ├── pre-commit                 # Hook pre-commit
│   └── commit-msg                 # Hook commit-msg
│
├── .github/                       # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml                 # CI/CD pipeline
│   │   └── release.yml            # Release automation
│   ├── ISSUE_TEMPLATE/            # Templates de issues
│   └── PULL_REQUEST_TEMPLATE.md   # Template de PRs
│
├── .vscode/                       # VSCode configuration
│   ├── settings.json              # Configuración del workspace
│   ├── extensions.json            # Extensiones recomendadas
│   ├── launch.json                # Debug configurations
│   └── tasks.json                 # Tasks de VSCode
│
├── docs/                          # Documentación
│   ├── ARCHITECTURE.md            # Arquitectura del sistema
│   └── DEPLOYMENT.md              # Guía de despliegue
│
├── scripts/                       # Scripts de utilidad
│   ├── deploy.sh                  # Deployment automático
│   ├── setup.sh                   # Setup Linux/Mac
│   ├── setup.ps1                  # Setup Windows
│   └── check-health.sh            # Health check
│
├── nginx/                         # Configuración Nginx
│   ├── nginx.conf                 # Config global
│   ├── prod.conf                  # Config de producción
│   └── ssl/                       # Certificados SSL
│
├── snies-frontend/                # 🎨 Aplicación Next.js
│   ├── app/                       # App Router
│   │   ├── (dashboard)/           # Rutas privadas
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── software-activities/
│   │   │   ├── wellbeing/
│   │   │   └── layout.tsx
│   │   ├── login/                 # Login público
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home
│   │   └── globals.css            # Estilos globales
│   │
│   ├── components/                # Componentes compartidos
│   │   ├── ui/                    # Componentes base (shadcn)
│   │   ├── charts/                # Componentes de gráficos
│   │   ├── dashboard-header.tsx
│   │   ├── page-header.tsx
│   │   └── ...
│   │
│   ├── modules/                   # 📦 Módulos por dominio
│   │   └── module_name/
│   │       ├── domain/            # Tipos e interfaces
│   │       ├── application/       # Hooks y lógica
│   │       ├── infrastructure/    # API calls
│   │       └── presentation/      # Componentes UI
│   │
│   ├── shared/                    # Código compartido
│   │   ├── api/                   # Cliente API base
│   │   ├── config/                # Configuración
│   │   └── utils/                 # Utilidades
│   │
│   ├── lib/                       # Librerías y helpers
│   ├── public/                    # Archivos estáticos
│   ├── styles/                    # Estilos CSS
│   │
│   ├── package.json               # Dependencias frontend
│   ├── tsconfig.json              # Config TypeScript
│   ├── next.config.mjs            # Config Next.js
│   ├── tailwind.config.js         # Config Tailwind
│   └── Dockerfile                 # Docker para desarrollo
│
└── snies-backend/                 # 🔧 API Django
    ├── config/                    # ⚙️ Configuración Django
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    │
    ├── users/                     # 👥 Módulo de usuarios
    │   ├── domain/
    │   ├── application/
    │   ├── infrastructure/
    │   ├── presentation/
    │   └── migrations/
    │
    ├── courses/                   # 📚 Módulo de cursos
    ├── software_activities/       # 💻 Actividades de software
    ├── wellbeing_activities/      # 🌱 Bienestar
    ├── continuing_education/      # 📖 Educación continuada
    ├── wellbeing_human_resources/ # 👨‍🏫 Recursos humanos
    ├── audit/                     # 📋 Auditoría
    ├── stats/                     # 📊 Estadísticas
    │
    ├── docker/                    # Scripts Docker
    │   ├── entrypoint.sh
    │   └── entrypoint-wrapper.sh
    │
    ├── requirements.txt           # Dependencias producción
    ├── requirements-dev.txt       # Dependencias desarrollo
    ├── pytest.ini                 # Config pytest
    ├── pyproject.toml             # Config Python tools
    ├── .flake8                    # Config Flake8
    ├── manage.py                  # Django management
    └── Dockerfile                 # Docker para desarrollo
```

---

## 🗄️ Base de Datos

### Modelos Principales

- **Users** - Usuarios del sistema con roles
- **Courses** - Programas académicos
- **SoftwareActivities** - Proyectos tecnológicos
- **WellbeingActivities** - Programas de bienestar
- **ContinuingEducation** - Cursos de extensión
- **WellbeingHumanResources** - Gestión de docentes
- **Audit** - Logs de auditoría
- **Stats** - Estadísticas del sistema

### Migraciones

```bash
# Crear nuevas migraciones
npm run makemigrations

# Aplicar migraciones
npm run migrate

# Ver estado
docker-compose exec backend python manage.py showmigrations
```

### Backups

```bash
# Crear backup
docker-compose exec db pg_dump -U postgres snies_db > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U postgres snies_db < backup.sql
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación.

### Obtener Token

```bash
POST /api/token/
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña"
}

# Respuesta:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Usar Token

```bash
GET /api/resource/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Renovar Token

```bash
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 🧪 Testing

### Frontend

```bash
# Ejecutar tests
npm run test:frontend

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:frontend -- --coverage
```

### Backend

```bash
# Ejecutar tests
npm run test:backend

# Con Docker
docker-compose exec backend pytest

# Coverage
docker-compose exec backend pytest --cov
```

---

## 🎨 Code Style

### Linting y Formateo Automático

El proyecto tiene configurado **linting automático** antes de cada commit gracias a Husky:

```bash
# Manual
npm run lint          # Lint todo
npm run format        # Formatear todo

# Específico
npm run lint:frontend
npm run format:frontend
npm run format:backend
```

### Convenciones

- **TypeScript/JavaScript**: ESLint + Prettier
- **Python**: Black + isort + Flake8
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formateo
refactor: refactorización
test: tests
chore: mantenimiento
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas!

### Workflow

1. **Fork** el proyecto
2. **Crear rama** (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abrir Pull Request**

### Antes de Contribuir

Lee nuestra [Guía de Contribución](./CONTRIBUTING.md) que incluye:
- Estándares de código
- Proceso de PR
- Convenciones de commits
- Guía de estilo

---

## 🐛 Reportar Bugs

Si encuentras un bug:

1. Busca en [Issues existentes](https://github.com/tu-org/Monorepo/issues)
2. Si no existe, [crea un nuevo issue](https://github.com/tu-org/Monorepo/issues/new/choose)
3. Usa el template de Bug Report
4. Incluye:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Screenshots (si aplica)
   - Entorno (OS, navegador, versión)

---

## 💡 Solicitar Features

Para solicitar una nueva funcionalidad:

1. [Crea un Feature Request](https://github.com/tu-org/Monorepo/issues/new/choose)
2. Describe el problema que resuelve
3. Propón una solución
4. Agrega mockups o referencias (opcional)

---

## 🆘 Soporte

### Recursos

- 📖 **Documentación**: `/docs` en el repositorio
- 💬 **Issues**: [GitHub Issues](https://github.com/tu-org/Monorepo/issues)
- 📧 **Email**: soporte@fesc.edu.co

### Problemas Comunes

Ver [QUICK_START.md](./QUICK_START.md) sección "Solución de Problemas"

---

## 📄 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

---

## 👥 Equipo

**Fundación de Estudios Superiores Comfanorte (FESC)**

- Tech Lead: [Nombre]
- Backend Team: [Nombre]
- Frontend Team: [Nombre]
- DevOps: [Nombre]

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Y todas las librerías open source utilizadas

---

## 📊 Estado del Proyecto

### CI/CD Status

[![CI Pipeline](https://github.com/tu-org/Monorepo/workflows/CI/badge.svg)](https://github.com/tu-org/Monorepo/actions)

### Métricas

- **Líneas de Código**: ~50,000+
- **Módulos**: 10+
- **Tests**: [Agregar cuando estén]
- **Coverage**: [Agregar cuando esté]

---

## 🗺️ Roadmap

### Próximas Funcionalidades

- [ ] Tests E2E con Playwright
- [ ] Storybook para componentes
- [ ] GraphQL API
- [ ] Notificaciones en tiempo real
- [ ] App móvil (React Native)
- [ ] Dashboard analytics avanzado
- [ ] Integración con APIs externas
- [ ] Sistema de reportes PDF
- [ ] Multi-tenancy

---

## 📝 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md) para historial detallado de cambios.

---

## ⭐ Star History

Si este proyecto te es útil, ¡dale una estrella! ⭐

---

<div align="center">

**[⬆ Volver arriba](#-sistema-snies---fesc)**

Hecho con ❤️ por el equipo de FESC

</div>
