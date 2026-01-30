# Arquitectura del Sistema SNIES

Este documento describe la arquitectura del sistema SNIES, un monorepo que contiene frontend (Next.js) y backend (Django).

## 📐 Visión General

El sistema sigue una arquitectura **modular y desacoplada** que facilita la escalabilidad y el mantenimiento:

```
┌─────────────────────────────────────────────────────────────┐
│                      SNIES MONOREPO                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   FRONTEND (Next.js) │◄────►│   BACKEND (Django)   │    │
│  │                      │ HTTP  │                      │    │
│  │  - App Router        │ REST  │  - REST API          │    │
│  │  - TypeScript        │ JSON  │  - Arquitectura Hex  │    │
│  │  - Tailwind + UI     │       │  - JWT Auth          │    │
│  └──────────────────────┘      └──────────────────────┘    │
│           │                              │                   │
│           │                              ▼                   │
│           │                     ┌──────────────────┐        │
│           └────────────────────►│   PostgreSQL 16  │        │
│                                 │                  │        │
│                                 └──────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Principios de Diseño

### 1. Separación de Responsabilidades
- Frontend maneja UI/UX y lógica de presentación
- Backend maneja lógica de negocio y persistencia
- Base de datos maneja almacenamiento de datos

### 2. Arquitectura Hexagonal (Backend)
- **Domain**: Lógica de negocio pura, independiente de frameworks
- **Application**: Casos de uso que orquestan la lógica de dominio
- **Infrastructure**: Adaptadores para BD, APIs externas, etc.
- **Presentation**: Capa de presentación (REST API)

### 3. Arquitectura Modular (Frontend)
- **Domain**: Tipos e interfaces de negocio
- **Application**: Lógica de negocio del cliente
- **Infrastructure**: Servicios externos (API calls)
- **Presentation**: Componentes React

## 🏗️ Backend - Django con Arquitectura Hexagonal

### Estructura de un Módulo

```
module_name/
├── domain/                      # NÚCLEO - Sin dependencias externas
│   ├── entities/
│   │   └── module_entity.py     # Entidades del dominio
│   ├── repositories/
│   │   └── module_repository.py # Interfaces de repositorios
│   ├── services/
│   │   └── module_service.py    # Servicios de dominio
│   └── exceptions.py            # Excepciones de dominio
│
├── application/                 # CASOS DE USO
│   └── use_cases/
│       ├── create_module.py     # Crear entidad
│       ├── update_module.py     # Actualizar entidad
│       ├── delete_module.py     # Eliminar entidad
│       └── list_modules.py      # Listar entidades
│
├── infrastructure/              # ADAPTADORES EXTERNOS
│   └── persistence/
│       └── django/
│           ├── models.py        # Modelos Django ORM
│           └── module_repository.py  # Implementación del repo
│
├── presentation/                # API REST
│   └── api/
│       └── module_name/
│           ├── serializers.py   # Serializers DRF
│           ├── views.py         # ViewSets / APIViews
│           └── urls.py          # Rutas
│
└── migrations/                  # Migraciones de Django
    └── 0001_initial.py
```

### Flujo de una Request

```
HTTP Request
    ↓
Presentation (View)
    ↓
Application (Use Case)
    ↓
Domain (Service)
    ↓
Infrastructure (Repository)
    ↓
Database
    ↓
... (regresa por el mismo camino)
    ↓
HTTP Response
```

### Ventajas de Arquitectura Hexagonal

1. **Testeable**: Lógica de negocio sin dependencias de frameworks
2. **Mantenible**: Cambios en UI/BD no afectan el negocio
3. **Escalable**: Fácil agregar nuevos adaptadores
4. **Independiente**: El dominio no conoce Django, PostgreSQL, etc.

## 💻 Frontend - Next.js con App Router

### Estructura

```
snies-frontend/
├── app/                        # App Router de Next.js
│   ├── (dashboard)/            # Grupo de rutas privadas
│   │   ├── dashboard/          # /dashboard
│   │   ├── users/              # /users
│   │   ├── courses/            # /courses
│   │   └── layout.tsx          # Layout compartido
│   ├── login/                  # /login (público)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home
│
├── components/                 # Componentes compartidos
│   ├── ui/                     # Componentes UI base (shadcn)
│   ├── charts/                 # Componentes de gráficos
│   └── ...                     # Otros componentes
│
├── modules/                    # Módulos por dominio
│   └── module_name/
│       ├── domain/             # Tipos e interfaces
│       │   └── types.ts
│       ├── application/        # Hooks y lógica
│       │   └── hooks/
│       │       └── useModule.ts
│       ├── infrastructure/     # Servicios API
│       │   └── api/
│       │       └── module-api.ts
│       └── presentation/       # Componentes UI
│           └── components/
│               └── ModuleForm.tsx
│
├── shared/                     # Código compartido
│   ├── api/                    # Cliente API base
│   ├── config/                 # Configuración
│   └── utils/                  # Utilidades
│
└── lib/                        # Librerías y helpers
    └── utils.ts
```

### Flujo de Datos

```
User Interaction
    ↓
Component (Presentation)
    ↓
Hook (Application)
    ↓
API Service (Infrastructure)
    ↓
HTTP Request → Backend
    ↓
... (response)
    ↓
Update State
    ↓
Re-render Component
```

### Patrones Utilizados

1. **Server Components**: Para data fetching inicial
2. **Client Components**: Para interactividad
3. **React Hook Form + Zod**: Formularios con validación
4. **Custom Hooks**: Encapsular lógica reutilizable
5. **API Client**: Cliente HTTP centralizado

## 🔐 Autenticación y Autorización

### JWT Flow

```
┌─────────┐                ┌─────────┐               ┌──────────┐
│ Cliente │                │ Backend │               │   BD     │
└────┬────┘                └────┬────┘               └────┬─────┘
     │                          │                         │
     │  1. POST /api/token/     │                         │
     │  {username, password}    │                         │
     ├─────────────────────────►│                         │
     │                          │  2. Verify credentials  │
     │                          ├────────────────────────►│
     │                          │◄────────────────────────┤
     │  3. {access, refresh}    │                         │
     │◄─────────────────────────┤                         │
     │                          │                         │
     │  4. GET /api/resource    │                         │
     │  Header: Bearer {token}  │                         │
     ├─────────────────────────►│                         │
     │                          │  5. Validate token      │
     │                          │  6. Get resource        │
     │                          ├────────────────────────►│
     │                          │◄────────────────────────┤
     │  7. {data}               │                         │
     │◄─────────────────────────┤                         │
     │                          │                         │
```

### Tokens

- **Access Token**: Corta duración (60 min), para autenticar requests
- **Refresh Token**: Larga duración (7 días), para renovar access token

### Frontend Storage

- Tokens se guardan en `localStorage`
- Se incluyen en headers de cada request
- Auto-refresh cuando el token expira

## 🗄️ Base de Datos

### PostgreSQL 16

```
┌────────────────────────────────────────────┐
│           PostgreSQL Database              │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  Users   │  │ Courses  │  │Software  ││
│  │  Table   │  │  Table   │  │Activities││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘│
│       │             │              │      │
│       └─────────────┴──────────────┘      │
│              Foreign Keys                  │
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │Wellbeing │  │Continuing│  │   Audit  ││
│  │Activities│  │Education │  │   Logs   ││
│  └──────────┘  └──────────┘  └──────────┘│
│                                            │
└────────────────────────────────────────────┘
```

### Características

- **Transacciones ACID**
- **Foreign Keys** para integridad referencial
- **Índices** en campos frecuentemente consultados
- **Migraciones** versionadas con Django

## 🐳 Docker y Orquestación

### Servicios

```yaml
services:
  db:        # PostgreSQL 16
  backend:   # Django + Gunicorn
  frontend:  # Next.js
```

### Volúmenes

- `postgres_data`: Persiste datos de PostgreSQL
- `./snies-backend:/app`: Hot reload para desarrollo
- `./snies-frontend:/app`: Hot reload para desarrollo
- `/app/node_modules`: Cache de node_modules

### Networks

Todos los servicios en la misma red de Docker, pueden comunicarse por nombre de servicio.

## 🚀 CI/CD Pipeline

### GitHub Actions

```
┌──────────────┐
│  Push/PR     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Detect Changes   │ ◄─── Optimización: Solo testea lo que cambió
└──────┬───────────┘
       │
       ├─────────────────┬─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐  ┌─────────────┐
│Lint Frontend│   │Test Backend │  │Build Docker │
└──────┬──────┘   └──────┬──────┘  └──────┬──────┘
       │                 │                 │
       └─────────────────┴─────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  All Passed │
                  └─────────────┘
```

### Checks

1. **Lint Frontend**: ESLint + TypeScript
2. **Test Backend**: Pytest + Coverage
3. **Build**: Docker images
4. **Format**: Black + Prettier

## 📊 Monitoreo y Logs

### Desarrollo

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Producción (Futuro)

- **Sentry**: Monitoreo de errores
- **Prometheus**: Métricas
- **Grafana**: Dashboards
- **ELK Stack**: Logs centralizados

## 🔧 Decisiones Técnicas

### ¿Por qué Monorepo?

✅ **Pros**:
- Versionado unificado
- Compartir código entre frontend/backend
- Despliegues coordinados
- Refactorings más seguros

❌ **Contras**:
- Repositorio más grande
- Posibles conflictos en PRs grandes

**Decisión**: Los pros superan los contras para nuestro caso de uso.

### ¿Por qué Arquitectura Hexagonal?

- **Testeable**: Lógica de negocio aislada
- **Mantenible**: Cambios localizados
- **Escalable**: Fácil agregar adaptadores
- **Estándar**: Patrón conocido en la industria

### ¿Por qué Next.js App Router?

- **RSC**: Server Components para mejor performance
- **Routing**: Sistema de rutas basado en archivos
- **Optimización**: Imágenes, fonts, scripts optimizados
- **DX**: Excelente experiencia de desarrollo

## 📚 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Django Best Practices](https://docs.djangoproject.com/en/stable/misc/design-philosophies/)
- [Monorepo Best Practices](https://monorepo.tools/)

---

**Última actualización**: 2026-01-30
