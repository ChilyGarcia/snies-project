# 🛠️ Guía de Infraestructura - Despliegue en VPS

**Audiencia:** Equipo de Infraestructura / DevOps

Esta guía proporciona instrucciones paso a paso para desplegar el sistema SNIES en un servidor VPS.

---

## 📋 Prerequisitos del Servidor

### Especificaciones Mínimas del VPS

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| **OS** | Ubuntu 22.04 / Debian 11 | Ubuntu 22.04 LTS |
| **RAM** | 2GB | 4GB+ |
| **CPU** | 2 cores | 4 cores |
| **Disco** | 20GB | 40GB+ SSD |
| **Red** | IP Pública | IP Pública + Dominio |

### Software Requerido

- ✅ Docker 24+
- ✅ Docker Compose 2.20+
- ✅ Git
- ✅ (Opcional) Certbot para SSL

---

## 🚀 Procedimiento de Instalación

### PASO 1: Conectar al VPS

```bash
# Conectar via SSH
ssh usuario@tu-ip-vps

# O con llave privada
ssh -i ~/.ssh/tu-llave.pem usuario@tu-ip-vps
```

---

### PASO 2: Instalar Docker y Dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose (si no está incluido)
sudo apt install docker-compose-plugin -y

# Instalar Git
sudo apt install git -y

# IMPORTANTE: Cerrar sesión y volver a conectar
exit
# (Reconectar via SSH)
```

**Verificar instalación:**
```bash
docker --version          # Debe mostrar: Docker version 24.x.x
docker compose version    # Debe mostrar: Docker Compose version v2.x.x
git --version            # Debe mostrar: git version 2.x.x
```

---

### PASO 3: Configurar Firewall

```bash
# Permitir SSH (IMPORTANTE: hacer esto primero)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw --force enable

# Verificar reglas
sudo ufw status numbered
```

**Salida esperada:**
```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
```

---

### PASO 4: Clonar el Repositorio

```bash
# Crear directorio para aplicaciones
sudo mkdir -p /opt
cd /opt

# Clonar repositorio
sudo git clone https://github.com/tu-organizacion/Monorepo.git snies

# Cambiar propietario al usuario actual
sudo chown -R $USER:$USER /opt/snies

# Entrar al directorio
cd /opt/snies

# Verificar contenido
ls -la
```

**Archivos esperados:**
```
.env.example
.env.production.example
docker-compose.yml
docker-compose.prod.yml
scripts/
nginx/
snies-backend/
snies-frontend/
README.md
```

---

### PASO 5: Configurar Variables de Entorno

```bash
# Copiar template de producción
cp .env.production.example .env

# Editar con nano (o vim)
nano .env
```

**Variables CRÍTICAS a Configurar:**

```env
# 1. BASE DE DATOS
DB_NAME=snies_prod_db
DB_USER=snies_user
DB_PASSWORD=TU_CONTRASEÑA_SEGURA_AQUI    # ⚠️ CAMBIAR

# 2. DJANGO SECRET KEY
# Generar con: python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY=TU_CLAVE_SECRETA_GENERADA_AQUI    # ⚠️ CAMBIAR

# 3. SEGURIDAD
DEBUG=False    # ⚠️ NUNCA cambiar a True en producción

# 4. DOMINIOS (cambiar por tu dominio o IP)
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com,123.45.67.89    # ⚠️ CAMBIAR
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com    # ⚠️ CAMBIAR
CSRF_TRUSTED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com    # ⚠️ CAMBIAR

# 5. FRONTEND (cambiar por tu dominio o IP)
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api    # ⚠️ CAMBIAR
# Si NO tienes SSL aún, usa: http://tu-ip-vps/api

# 6. PUERTOS (generalmente dejar como están)
HTTP_PORT=80
HTTPS_PORT=443
```

**Generar SECRET_KEY seguro:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copiar el resultado y pegarlo en `SECRET_KEY=` en el archivo `.env`

**Guardar y salir:**
- Presionar `Ctrl + X`
- Presionar `Y` (Yes)
- Presionar `Enter`

**Verificar configuración:**
```bash
# Ver que no haya valores "CAMBIAR"
cat .env | grep -i "cambiar"
# No debe mostrar nada
```

---

### PASO 6: Ejecutar Deployment

```bash
# Hacer ejecutable el script
chmod +x scripts/deploy.sh

# Ejecutar deployment automático
./scripts/deploy.sh
```

**El script hará automáticamente:**
1. ✅ Verificar variables de entorno
2. ✅ Construir imágenes Docker optimizadas
3. ✅ Detener contenedores antiguos (si existen)
4. ✅ Iniciar nuevos contenedores
5. ✅ Esperar a que servicios estén listos
6. ✅ Ejecutar migraciones de base de datos
7. ✅ Recolectar archivos estáticos
8. ✅ Verificar estado de servicios

**Tiempo estimado:** 5-10 minutos

**Salida esperada al final:**
```
✅ Deployment completado exitosamente!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Tu aplicación está corriendo en:

Frontend: http://123.45.67.89
Backend:  http://123.45.67.89/api
Admin:    http://123.45.67.89/admin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### PASO 7: Crear Superusuario

```bash
# Ejecutar comando interactivo
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

**Ingresar cuando se solicite:**
```
Username: admin
Email address: admin@tuempresa.com
Password: ********
Password (again): ********
```

**Confirmación:**
```
Superuser created successfully.
```

---

### PASO 8: Verificar Deployment

#### Verificar Contenedores

```bash
# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps
```

**Salida esperada (todos "Up"):**
```
NAME                   STATUS          PORTS
snies_backend_prod     Up 2 minutes    0.0.0.0:8000->8000/tcp
snies_db_prod          Up 2 minutes    0.0.0.0:5432->5432/tcp
snies_frontend_prod    Up 2 minutes    0.0.0.0:3000->3000/tcp
snies_nginx_prod       Up 2 minutes    0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

#### Verificar Logs

```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs --tail=50

# Ver logs específicos
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

#### Probar Acceso Web

**Desde tu computadora local:**

1. **Frontend**: Abrir en navegador `http://tu-ip-vps`
   - Debe cargar la página principal del sistema

2. **Admin Django**: Abrir `http://tu-ip-vps/admin`
   - Debe mostrar la página de login de Django
   - Intentar login con el superusuario creado

3. **API**: Abrir `http://tu-ip-vps/api/`
   - Debe mostrar la API root de Django REST Framework

#### Probar Desde el Servidor

```bash
# Health check del backend
curl http://localhost/health/

# Debe responder con status 200
```

---

## 🔒 PASO 9: Configurar SSL/HTTPS (Recomendado)

### Opción A: Con Let's Encrypt (Gratis)

**Solo si tienes un DOMINIO configurado apuntando al VPS**

```bash
# 1. Instalar Certbot
sudo apt install -y certbot

# 2. Detener Nginx temporalmente
docker-compose -f docker-compose.prod.yml stop nginx

# 3. Obtener certificado
sudo certbot certonly --standalone \
  -d tu-dominio.com \
  -d www.tu-dominio.com \
  --email tu-email@example.com \
  --agree-tos \
  --no-eff-email

# 4. Crear directorio para certificados
mkdir -p /opt/snies/nginx/ssl

# 5. Copiar certificados
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem /opt/snies/nginx/ssl/
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem /opt/snies/nginx/ssl/

# 6. Dar permisos
sudo chown $USER:$USER /opt/snies/nginx/ssl/*
chmod 644 /opt/snies/nginx/ssl/*.pem

# 7. Editar configuración de Nginx
cd /opt/snies
nano nginx/prod.conf
```

**Descomentar líneas de SSL:**
```nginx
# Buscar y descomentar (quitar #):
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    # ... resto de configuración
}
```

**Actualizar .env:**
```bash
nano .env
```

Cambiar:
```env
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
CSRF_TRUSTED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
```

```bash
# 8. Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# 9. Configurar renovación automática
sudo crontab -e
```

Agregar al final:
```
0 3 * * * certbot renew --quiet && docker-compose -f /opt/snies/docker-compose.prod.yml restart nginx
```

**Verificar:** Abrir `https://tu-dominio.com` (debe tener candado 🔒)

### Opción B: Sin Dominio (Solo HTTP)

Si NO tienes dominio, la aplicación funcionará con HTTP en la IP del servidor.

⚠️ **Nota:** HTTP es menos seguro, recomendamos obtener un dominio y configurar SSL.

---

## 📊 Monitoreo y Mantenimiento

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml logs -f

# Solo backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Solo nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Últimas 100 líneas
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Verificar Uso de Recursos

```bash
# CPU y Memoria de contenedores
docker stats

# Espacio en disco
df -h

# Uso de Docker
docker system df
```

### Reiniciar Servicios

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml restart

# Un servicio específico
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart nginx
```

### Detener Servicios

```bash
# Detener sin eliminar datos
docker-compose -f docker-compose.prod.yml stop

# Detener y eliminar contenedores (pero NO datos)
docker-compose -f docker-compose.prod.yml down

# ⚠️ Detener y eliminar TODO (incluida la base de datos)
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🔄 Actualizar la Aplicación

Cuando haya cambios en el código:

```bash
# 1. Ir al directorio
cd /opt/snies

# 2. Obtener cambios
git pull origin main

# 3. Re-deployar (automático)
./scripts/deploy.sh
```

**Tiempo:** 3-5 minutos

---

## 💾 Backups

### Backup de Base de Datos

```bash
# Crear backup
cd /opt/snies
docker-compose -f docker-compose.prod.yml exec db pg_dump -U snies_user snies_prod_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Verificar backup
ls -lh backup_*.sql
```

### Restaurar Backup

```bash
# Restaurar desde backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U snies_user snies_prod_db < backup_20260130_120000.sql
```

### Backup Automatizado (Cron)

```bash
# Editar crontab
crontab -e
```

Agregar:
```bash
# Backup diario a las 2 AM
0 2 * * * cd /opt/snies && docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U snies_user snies_prod_db > /opt/backups/snies_backup_$(date +\%Y\%m\%d).sql

# Limpiar backups antiguos (más de 7 días)
0 3 * * * find /opt/backups -name "snies_backup_*.sql" -mtime +7 -delete
```

Crear directorio:
```bash
sudo mkdir -p /opt/backups
sudo chown $USER:$USER /opt/backups
```

---

## 🐛 Troubleshooting

### Problema: Contenedores no inician

```bash
# Ver logs detallados
docker-compose -f docker-compose.prod.yml logs

# Verificar .env
cat .env | grep -v "^#" | grep -v "^$"

# Verificar puertos en uso
sudo netstat -tlnp | grep -E '(80|443|8000|3000|5432)'

# Reiniciar Docker
sudo systemctl restart docker
```

### Problema: Error 502 Bad Gateway

```bash
# Verificar backend
docker-compose -f docker-compose.prod.yml ps backend
docker-compose -f docker-compose.prod.yml logs backend

# Reiniciar backend
docker-compose -f docker-compose.prod.yml restart backend

# Verificar nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Problema: Base de datos no conecta

```bash
# Verificar PostgreSQL
docker-compose -f docker-compose.prod.yml ps db
docker-compose -f docker-compose.prod.yml logs db

# Conectar manualmente a la BD
docker-compose -f docker-compose.prod.yml exec db psql -U snies_user -d snies_prod_db

# Salir con: \q
```

### Problema: Espacio en disco lleno

```bash
# Ver uso de espacio
df -h

# Limpiar Docker
docker system prune -a --volumes

# ⚠️ CUIDADO: Esto elimina TODOS los contenedores, imágenes y volúmenes no usados
```

### Problema: Aplicación muy lenta

```bash
# Ver uso de recursos
docker stats

# Si CPU/RAM al 100%, considerar upgrade del VPS
# O ajustar workers de Gunicorn en docker-compose.prod.yml
```

---

## 📋 Checklist Post-Deployment

Verificar que todo funcione:

- [ ] Contenedores corriendo (`docker-compose ps`)
- [ ] Frontend accesible (`http://tu-ip/`)
- [ ] Backend accesible (`http://tu-ip/api/`)
- [ ] Admin Django accesible (`http://tu-ip/admin/`)
- [ ] Login funciona
- [ ] SSL configurado (si aplica)
- [ ] Firewall habilitado
- [ ] Backups configurados
- [ ] Logs sin errores críticos
- [ ] Recursos del servidor aceptables (<80% CPU/RAM)

---

## 🔐 Hardening de Seguridad (Recomendado)

### Cambiar Puerto SSH

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambiar línea:
Port 2222  # O cualquier puerto > 1024

# Guardar y reiniciar
sudo systemctl restart sshd

# Actualizar firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### Deshabilitar Login Root

```bash
# Editar configuración SSH
sudo nano /etc/ssh/sshd_config

# Cambiar línea:
PermitRootLogin no

# Reiniciar
sudo systemctl restart sshd
```

### Instalar Fail2ban

```bash
# Instalar
sudo apt install fail2ban -y

# Habilitar
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📞 Soporte

### Contactos

- **Equipo de Desarrollo:** [email/slack]
- **Documentación:** `/opt/snies/docs/`
- **Issues:** GitHub Issues

### Comandos Útiles de Referencia

```bash
# Ver todos los servicios
docker-compose -f docker-compose.prod.yml ps

# Logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar
docker-compose -f docker-compose.prod.yml restart

# Detener
docker-compose -f docker-compose.prod.yml down

# Actualizar
cd /opt/snies && git pull && ./scripts/deploy.sh

# Backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U snies_user snies_prod_db > backup.sql
```

---

## ✅ Resumen: Comandos Rápidos

```bash
# Setup inicial (una sola vez)
cd /opt
sudo git clone <repo-url> snies && cd snies
sudo chown -R $USER:$USER .
cp .env.production.example .env
nano .env  # Editar variables
chmod +x scripts/deploy.sh
./scripts/deploy.sh
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Updates (cuando haya cambios)
cd /opt/snies
git pull origin main
./scripts/deploy.sh

# Monitoreo diario
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs --tail=50
docker stats
```

---

**Tiempo total de setup:** ~30 minutos
**Actualización:** ~5 minutos
**Última revisión:** 2026-01-30

---

## 🎉 ¡Deployment Completo!

Una vez completados todos los pasos, tu aplicación SNIES estará:
- ✅ Corriendo en producción
- ✅ Accesible desde internet
- ✅ Optimizada para performance
- ✅ Segura con configuración de producción
- ✅ Con backups configurados
- ✅ Monitoreable y mantenible

**¡Felicitaciones!** 🚀
