# 🔧 Solución de Problemas - SNIES Monorepo

Guía rápida para resolver problemas comunes.

---

## 🐳 Problemas con Docker

### Frontend se reinicia continuamente

**Síntomas:**
- El contenedor `snies_frontend` se reinicia cada pocos segundos
- Errores de Turbopack en los logs
- `FATAL: An unexpected Turbopack error occurred`

**Solución:**

```bash
# 1. Detener servicios
docker-compose down

# 2. Limpiar contenedores y volúmenes
docker-compose down -v

# 3. Reconstruir frontend sin cache
docker-compose build --no-cache frontend

# 4. Levantar de nuevo
docker-compose up
```

**Causa:** Bug conocido de Next.js 16 con Turbopack.

**Fix aplicado:** Se usa webpack por defecto (sin flag `--turbo`). Turbopack solo se activa si se usa explícitamente `--turbo`.

---

### Base de datos no conecta

**Síntomas:**
- Backend no puede conectar a PostgreSQL
- Error: `could not connect to server`

**Solución:**

```bash
# Verificar que la BD está corriendo
docker-compose ps db

# Ver logs de la BD
docker-compose logs db

# Reiniciar solo la BD
docker-compose restart db

# Si no funciona, recrear
docker-compose down
docker volume rm monorepo_postgres_data
docker-compose up
```

---

### Puerto ya en uso

**Síntomas:**
- Error: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solución:**

```bash
# Ver qué está usando el puerto
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :3000
lsof -i :8000

# Detener Docker y volver a intentar
docker-compose down
docker-compose up
```

---

### Contenedor se detiene inmediatamente

**Síntomas:**
- Contenedor inicia pero se detiene al instante
- Estado: `Exited (1) 2 seconds ago`

**Solución:**

```bash
# Ver logs del contenedor que falla
docker-compose logs frontend
docker-compose logs backend

# Reconstruir sin cache
docker-compose build --no-cache <servicio>

# Si es el frontend
docker-compose build --no-cache frontend
docker-compose up frontend
```

---

## 🌐 Problemas con el Frontend

### Página en blanco

**Solución:**

```bash
# Verificar logs del frontend
docker-compose logs frontend

# Limpiar cache de Next.js
cd snies-frontend
rm -rf .next node_modules
npm install

# O con Docker
docker-compose down
docker-compose build --no-cache frontend
docker-compose up
```

---

### Error 404 en rutas

**Solución:**

Verificar que la estructura de carpetas en `app/` sea correcta:

```
app/
├── (dashboard)/
│   └── dashboard/
│       └── page.tsx
├── login/
│   └── page.tsx
└── page.tsx
```

---

### Hot reload no funciona

**Solución:**

```bash
# Agregar variables de entorno en docker-compose.yml
environment:
  WATCHPACK_POLLING: "true"
  CHOKIDAR_USEPOLLING: "true"

# Reiniciar
docker-compose restart frontend
```

---

## 🐍 Problemas con el Backend

### Migraciones fallan

**Síntomas:**
- Error al ejecutar `python manage.py migrate`

**Solución:**

```bash
# Verificar estado de migraciones
docker-compose exec backend python manage.py showmigrations

# Hacer fake migrate si es necesario
docker-compose exec backend python manage.py migrate --fake <app_name> <migration_number>

# Recrear migraciones
docker-compose exec backend python manage.py migrate --fake-initial
```

---

### Error de SECRET_KEY

**Síntomas:**
- `ImproperlyConfigured: The SECRET_KEY setting must not be empty`

**Solución:**

```bash
# Verificar que existe .env
cat .env

# Si no existe, crear
cp .env.example .env

# Generar SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Agregar al .env
echo "SECRET_KEY=<la_clave_generada>" >> .env

# Reiniciar
docker-compose restart backend
```

---

### CORS errors

**Síntomas:**
- Error en consola del navegador: `blocked by CORS policy`

**Solución:**

Verificar en `snies-backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

O en `.env`:

```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## 💾 Problemas con la Base de Datos

### Base de datos corrupta

**Solución:**

```bash
# ADVERTENCIA: Esto elimina todos los datos
docker-compose down
docker volume rm monorepo_postgres_data
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

### No se puede crear superusuario

**Solución:**

```bash
# Asegurarse de que las migraciones estén aplicadas
docker-compose exec backend python manage.py migrate

# Crear superusuario interactivamente
docker-compose exec backend python manage.py createsuperuser

# O desde Python shell
docker-compose exec backend python manage.py shell
```

Luego en el shell:
```python
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('admin', 'admin@example.com', 'password')
exit()
```

---

## 🚀 Problemas de Performance

### Aplicación muy lenta

**Solución:**

```bash
# Ver uso de recursos
docker stats

# Si CPU/RAM están al 100%, aumentar límites en docker-compose.yml:
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G

# O ajustar workers de Gunicorn en producción
```

---

### Build muy lento

**Solución:**

```bash
# Limpiar cache de Docker
docker builder prune

# O construir sin cache (más lento la primera vez)
docker-compose build --no-cache
```

---

## 🔒 Problemas de Permisos

### Permission denied en volúmenes

**Solución Linux/Mac:**

```bash
# Cambiar propietario de carpetas
sudo chown -R $USER:$USER snies-frontend snies-backend

# O ejecutar Docker con tu usuario
sudo usermod -aG docker $USER
# Cerrar sesión y volver a entrar
```

**Solución Windows:**

```powershell
# Asegurarse de que Docker Desktop tiene acceso a las carpetas
# Settings > Resources > File Sharing
```

---

## 🌍 Problemas de Red

### Contenedores no se comunican

**Solución:**

```bash
# Verificar red de Docker
docker network ls

# Recrear red
docker-compose down
docker network prune
docker-compose up
```

---

### DNS no resuelve

**Solución:**

En `docker-compose.yml`, agregar DNS público:

```yaml
services:
  frontend:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

---

## 🧹 Limpieza y Reset

### Limpieza completa

```bash
# Detener todo
docker-compose down -v

# Limpiar Docker completamente
docker system prune -a --volumes --force

# Limpiar node_modules
cd snies-frontend
rm -rf node_modules .next
cd ..

# Reinstalar y levantar
docker-compose up --build
```

---

## 📝 Logs y Debugging

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db

# Últimas 100 líneas
docker-compose logs --tail=100 frontend
```

---

### Entrar al contenedor

```bash
# Frontend
docker-compose exec frontend sh

# Backend
docker-compose exec backend bash

# Base de datos
docker-compose exec db psql -U postgres -d snies_db
```

---

## 🆘 Comandos de Emergencia

### Reset total del proyecto

```bash
# ADVERTENCIA: Elimina todo
docker-compose down -v
docker system prune -a --volumes --force
rm -rf snies-frontend/node_modules
rm -rf snies-frontend/.next
git clean -fdx
docker-compose up --build
```

---

### Verificar estado del sistema

```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats

# Espacio en disco
docker system df

# Logs de errores
docker-compose logs --tail=50 | grep -i error
```

---

## 📞 Obtener Ayuda

Si ninguna de estas soluciones funciona:

1. Ver logs completos: `docker-compose logs > logs.txt`
2. Verificar versiones: `docker --version`, `node --version`, `python --version`
3. Revisar `.env` está configurado correctamente
4. Abrir un issue en GitHub con:
   - Descripción del problema
   - Logs relevantes
   - Pasos para reproducir
   - Información del sistema

---

## ✅ Checklist de Verificación

Cuando algo no funciona, verificar:

- [ ] Docker está corriendo
- [ ] Puertos 3000, 8000, 5432 no están en uso
- [ ] Archivo `.env` existe y está configurado
- [ ] No hay errores en los logs
- [ ] Base de datos está corriendo (`docker-compose ps db`)
- [ ] Migraciones aplicadas
- [ ] Suficiente espacio en disco
- [ ] Internet funciona (para descargar dependencias)

---

**Última actualización:** 2026-01-30
