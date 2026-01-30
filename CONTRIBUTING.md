# Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto SNIES! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Workflow de Git](#workflow-de-git)
- [Estándares de Código](#estándares-de-código)
- [Convención de Commits](#convención-de-commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)

## 📜 Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamiento inaceptable al equipo del proyecto.

## 🤝 Cómo Contribuir

### 1. Fork el Proyecto

```bash
# Haz fork del repositorio desde GitHub
# Luego clona tu fork
git clone https://github.com/tu-usuario/Monorepo.git
cd Monorepo
```

### 2. Configura el Upstream

```bash
git remote add upstream https://github.com/organizacion/Monorepo.git
```

### 3. Mantén tu Fork Sincronizado

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## 🛠️ Configuración del Entorno

### Prerequisitos

- Docker y Docker Compose (recomendado)
- Node.js 18+ y npm
- Python 3.10+
- PostgreSQL 16+ (si no usas Docker)

### Instalación

```bash
# 1. Instala las dependencias del monorepo
npm install

# 2. Configura las variables de entorno
cp .env.example .env
# Edita .env con tus valores locales

# 3. Levanta los servicios
npm run docker:up

# 4. (Opcional) Instala husky para git hooks
npm run prepare
```

### Desarrollo Sin Docker

**Backend:**
```bash
cd snies-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend:**
```bash
cd snies-frontend
npm install
npm run dev
```

## 🔄 Workflow de Git

### Ramas

- `main` - Código en producción, siempre estable
- `develop` - Rama de desarrollo, integración de features
- `feature/<nombre>` - Nuevas funcionalidades
- `fix/<nombre>` - Corrección de bugs
- `hotfix/<nombre>` - Fixes urgentes para producción
- `refactor/<nombre>` - Refactorizaciones
- `docs/<nombre>` - Cambios de documentación

### Crear una Nueva Rama

```bash
# Asegúrate de estar en main y actualizado
git checkout main
git pull upstream main

# Crea tu rama
git checkout -b feature/nombre-descriptivo
```

### Hacer Cambios

```bash
# Haz tus cambios
# Ejecuta los tests
npm run test

# Ejecuta el linter
npm run lint

# Verifica el formato
npm run format

# Commit con mensaje convencional
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

## 🎨 Estándares de Código

### Frontend (TypeScript/React)

- **ESLint**: Seguimos las reglas configuradas en `.eslintrc`
- **Prettier**: Formato automático de código
- **TypeScript**: Tipado estricto, evita `any`
- **Componentes**: Usa componentes funcionales con hooks
- **Imports**: Organiza imports (externos, internos, relativos)

```typescript
// ✅ Bueno
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api";

interface UserProps {
  id: string;
  name: string;
}

export function UserCard({ id, name }: UserProps) {
  const [loading, setLoading] = useState(false);
  
  // ...
}

// ❌ Malo
import React from "react";
const UserCard = (props: any) => {
  // ...
}
```

### Backend (Python/Django)

- **PEP 8**: Estándar de Python
- **Black**: Formateador de código (100 caracteres)
- **isort**: Organización de imports
- **Type Hints**: Usa type hints cuando sea posible
- **Docstrings**: Documenta clases y funciones complejas

```python
# ✅ Bueno
from typing import List, Optional
from django.db import models


class User(models.Model):
    """Modelo de usuario del sistema."""
    
    email: str = models.EmailField(unique=True)
    is_active: bool = models.BooleanField(default=True)
    
    def get_full_name(self) -> str:
        """Retorna el nombre completo del usuario."""
        return f"{self.first_name} {self.last_name}"


# ❌ Malo
class User(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
```

### Nombres

- **Variables/Funciones**: `camelCase` (JS/TS), `snake_case` (Python)
- **Clases**: `PascalCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Archivos**: `kebab-case` (Frontend), `snake_case` (Backend)
- **Componentes**: `PascalCase.tsx`

## 📝 Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan el código)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o modificar tests
- `build`: Cambios en el sistema de build
- `ci`: Cambios en CI/CD
- `chore`: Tareas de mantenimiento
- `revert`: Revertir un commit anterior

### Scope (Opcional)

- `frontend`: Cambios en el frontend
- `backend`: Cambios en el backend
- `api`: Cambios en la API
- `ui`: Cambios en la interfaz
- `db`: Cambios en la base de datos
- `docker`: Cambios en Docker

### Ejemplos

```bash
# Feature
git commit -m "feat(frontend): agregar página de perfil de usuario"

# Fix
git commit -m "fix(backend): corregir validación de email en registro"

# Docs
git commit -m "docs: actualizar README con instrucciones de instalación"

# Refactor
git commit -m "refactor(api): simplificar lógica de autenticación"

# Breaking change
git commit -m "feat(api)!: cambiar estructura de respuesta de login

BREAKING CHANGE: La respuesta ahora incluye refresh_token separado"
```

## 🔍 Pull Requests

### Antes de Crear un PR

1. ✅ Asegúrate de que los tests pasen
2. ✅ Ejecuta el linter y formateador
3. ✅ Actualiza la documentación si es necesario
4. ✅ Sincroniza con la rama base más reciente
5. ✅ Revisa tus propios cambios

### Crear el PR

1. Push a tu fork:
```bash
git push origin feature/nombre-descriptivo
```

2. Ve a GitHub y crea el Pull Request

3. Completa la plantilla del PR con:
   - Descripción clara de los cambios
   - Issue relacionado (si existe)
   - Screenshots (si hay cambios visuales)
   - Checklist completada

### Revisión de Código

- Responde a los comentarios de manera constructiva
- Haz los cambios solicitados en commits nuevos
- Una vez aprobado, el PR será mergeado

### Estilo de PR

- **Título**: Sigue la convención de commits
- **Descripción**: Clara y detallada
- **Commits**: Pueden ser múltiples, serán squashed al mergear
- **Tamaño**: PRs pequeños y enfocados son mejores

## 🐛 Reportar Bugs

### Antes de Reportar

1. Busca en los issues existentes
2. Verifica que estés en la última versión
3. Intenta reproducir el bug

### Información a Incluir

- **Título**: Descripción breve y clara
- **Descripción**: Detallada del problema
- **Pasos para reproducir**: Lista numerada
- **Comportamiento esperado**: Qué debería pasar
- **Comportamiento actual**: Qué pasa realmente
- **Screenshots**: Si es relevante
- **Entorno**:
  - OS: Windows/Mac/Linux
  - Navegador: Chrome/Firefox/Safari
  - Versión del proyecto
- **Logs**: Errores de consola o logs relevantes

## ✨ Solicitar Features

### Template de Feature Request

```markdown
## Problema a Resolver
Describe el problema o necesidad que esta feature resolvería

## Solución Propuesta
Describe cómo imaginas que funcionaría

## Alternativas Consideradas
Otras soluciones que consideraste

## Contexto Adicional
Screenshots, mockups, ejemplos, etc.
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de Django REST Framework](https://www.django-rest-framework.org/)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar al equipo de desarrollo

---

¡Gracias por contribuir! 🎉
