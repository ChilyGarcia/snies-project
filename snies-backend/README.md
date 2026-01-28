# SNIES Backend

## 📋 Descripción

Este proyecto es el backend para el sistema **SNIES**, construido con **Django** y siguiendo una **Arquitectura Hexagonal (Ports and Adapters)**. El objetivo principal es garantizar la mantenibilidad, escalabilidad y desacoplamiento de la lógica de negocio del framework y herramientas externas.

## 🏗 Arquitectura Hexagonal

El proyecto está estructurado para separar claramente las responsabilidades, permitiendo que la aplicación crezca sin volverse un "espagueti" de código.

### Estructura de Directorios

El núcleo de la lógica reside en módulos desacoplados (e.g., `users`), estructurados internamente así:

```text
users/
├── application/       # Casos de Uso (Lógica de la aplicación)
│   └── use_cases/     # Acciones específicas (e.g., CrearUsuario)
├── domain/            # Lógica de Negocio Pura (Independiente del framework)
│   ├── entities/      # Modelos de dominio
│   ├── ports/         # Interfaces (Contratos para repositorios/servicios)
│   └── exceptions/    # Excepciones propias del dominio
├── infraestructure/   # Implementación técnica
│   └── persistence/   # Implementación de repositorios (Django ORM)
├── presentation/      # Puntos de entrada (API, CLI, Vistas)
│   └── api/           # Vistas y Serializadores (DRF)
└── migrations/        # Migraciones de base de datos de Django
```

### Por qué esta arquitectura?

1.  **Independencia del Framework**: La lógica de negocio (`domain`) no sabe que existe Django.
2.  **Testabilidad**: Es fácil probar los casos de uso sin necesidad de una base de datos o servidor web.
3.  **Escalabilidad**: Agregar nuevos módulos o cambiar la base de datos afecta solo a la capa de infraestructura, no a la lógica de negocio.

## 🚀 Guía de Inicio Rápido

### Prerrequisitos

- Python 3.10+
- Git

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/ChilyGarcia/snies-backend.git
cd snies-backend
```

### Paso 2: Configurar el entorno virtual

Es recomendable usar un entorno virtual para aislar las dependencias.

**Windows:**

```powershell
python -m venv venv
.\venv\Scripts\Activate
```

**Linux/Mac:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

### Paso 4: Configurar variables de entorno

Crea un archivo `.env` en la raíz (si es necesario) para configuraciones sensibles. Por defecto, Django usará `config/settings.py` para desarrollo local.

### Paso 5: Aplicar migraciones

Las migraciones crean la estructura de la base de datos.

```bash
python config/manage.py migrate
```

_Nota: El archivo `manage.py` se encuentra dentro de la carpeta `config`. Asegúrate de ejecutarlo desde allí o ajustar la ruta._

### Paso 6: Ejecutar el servidor

```bash
python config/manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000/`.

## 🐳 Docker (Django + Postgres con Docker Compose)

### Prerrequisitos

- Docker Desktop (con `docker compose`)

### Pasos

1. (Opcional) Si quieres sobreescribir variables (ej: `SECRET_KEY`, puertos, credenciales), crea un archivo `env` basado en `env.example` (en este repo no se permite crear archivos que inicien con `.`):

**PowerShell (Windows):**

```powershell
Copy-Item env.example env
```

**CMD (Windows):**

```bash
copy env.example env
```

**Linux/Mac:**

```bash
cp env.example env
```

2. Levanta todo (API + Postgres):

```bash
docker compose up --build
```

3. La API quedará disponible en `http://localhost:8000/`.

## 🚀 Docker para Producción (Gunicorn + Nginx + Postgres)

Esta variante usa:

- Gunicorn (en vez de `runserver`)
- Nginx como reverse proxy y para servir `/static/`
- Sin montar el código con `volumes` (imagen inmutable)

### Variables requeridas

Crea un archivo `env.prod` basado en `env.prod.example` y ajusta:

- `SECRET_KEY`
- `ALLOWED_HOSTS` (dominio/s)
- `DB_PASSWORD`
- `CSRF_TRUSTED_ORIGINS` si usas HTTPS

**PowerShell (Windows):**

```powershell
Copy-Item env.prod.example env.prod
```

### Levantar en producción

```bash
docker compose --env-file env.prod -f docker-compose.prod.yml up --build -d
```

La app quedará detrás de Nginx en `http://localhost` (o el puerto `NGINX_PORT_EXPOSE`).

### Parar y limpiar

```bash
docker compose down
```

Si quieres borrar también los datos persistidos de Postgres:

```bash
docker compose down -v
```

## 📦 Agregar un Nuevo Módulo

Para mantener la limpieza de la arquitectura, al crear una nueva aplicación Django (`python manage.py startapp nombre`), reestructura inmediatamente sus carpetas para seguir el patrón: `domain`, `application`, `infraestructure`, `presentation`.

---


