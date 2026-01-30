# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Agregado
- Configuración inicial del monorepo
- Documentación completa (README, CONTRIBUTING)
- Scripts de gestión del monorepo
- Configuración de CI/CD con GitHub Actions
- Git hooks con Husky y Commitlint
- Configuración de Turborepo
- Configuración de VSCode para desarrollo
- Makefile con comandos útiles
- Sistema de gestión de dependencias centralizado
- Templates para PRs
- Workflow de releases automatizado

### Frontend
- Aplicación Next.js 16+ con TypeScript
- Componentes UI con shadcn/ui
- Módulos por dominio (arquitectura modular)
- Integración con backend Django
- Sistema de autenticación JWT

### Backend
- API Django 4.2 con DRF
- Arquitectura hexagonal/limpia
- Múltiples módulos de dominio:
  - Usuarios
  - Cursos
  - Actividades de software
  - Bienestar
  - Educación continuada
- Integración con PostgreSQL 16
- Sistema de autenticación JWT

### Infraestructura
- Docker Compose para desarrollo
- PostgreSQL 16
- Hot reload para desarrollo
- Volúmenes persistentes

---

## Guía de Versionado

### [MAJOR.MINOR.PATCH]

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles con versiones anteriores
- **PATCH**: Correcciones de bugs compatibles con versiones anteriores

### Categorías de Cambios

- **Agregado** - Para nuevas funcionalidades
- **Cambiado** - Para cambios en funcionalidades existentes
- **Deprecado** - Para funcionalidades que serán eliminadas
- **Eliminado** - Para funcionalidades eliminadas
- **Corregido** - Para correcciones de bugs
- **Seguridad** - Para correcciones de vulnerabilidades

---

## [1.0.0] - 2026-01-30

### Agregado
- Release inicial del sistema SNIES
- Monorepo configurado con mejores prácticas

[Unreleased]: https://github.com/organizacion/Monorepo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/organizacion/Monorepo/releases/tag/v1.0.0
