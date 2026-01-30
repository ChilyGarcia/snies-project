# Guía de Despliegue en Producción

Esta guía detalla cómo desplegar el sistema SNIES en un VPS o servidor de producción.

## 📋 Prerequisitos

### Servidor VPS

- **OS**: Ubuntu 22.04+ / Debian 11+ (recomendado)
- **RAM**: Mínimo 2GB, recomendado 4GB+
- **Disco**: Mínimo 20GB
- **CPU**: Mínimo 2 cores
- **IP Pública**: Sí
- **Dominio**: Opcional pero recomendado

### Software Requerido

- Docker 24+
- Docker Compose 2.20+
- Git
- (Opcional) Certbot para SSL

## 🚀 Deployment Paso a Paso

### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y curl git ufw

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a entrar para aplicar cambios
exit
# (reconectar SSH)

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Configurar Firewall

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### 3. Clonar el Repositorio

```bash
# Navegar al directorio de aplicaciones
cd /opt

# Clonar repositorio
sudo git clone https://github.com/tu-organizacion/Monorepo.git snies
cd snies

# Cambiar propietario
sudo chown -R $USER:$USER /opt/snies
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.production.example .env

# Editar con tus valores
nano .env
```

**Valores CRÍTICOS que DEBES cambiar:**

```env
# Database - Usar contraseñas seguras
DB_PASSWORD=tu_contraseña_segura_aqui

# Django Secret Key - Generar una nueva
SECRET_KEY=tu_clave_secreta_generada

# Dominios - Usar tu dominio real
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
CORS_ALLOWED_ORIGINS=https://tu-dominio.com
CSRF_TRUSTED_ORIGINS=https://tu-dominio.com

# API URL - Usar tu dominio real
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
```

**Para generar un SECRET_KEY seguro:**

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Desplegar con el Script

```bash
# Hacer ejecutable el script
chmod +x scripts/deploy.sh

# Ejecutar deployment
./scripts/deploy.sh
```

El script automáticamente:
- ✅ Verifica variables de entorno
- ✅ Construye imágenes Docker
- ✅ Inicia contenedores
- ✅ Ejecuta migraciones
- ✅ Recolecta archivos estáticos
- ✅ Verifica estado de servicios

### 6. Crear Superusuario

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### 7. Verificar Deployment

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Verificar salud
curl http://localhost/health/
```

### 8. Acceder a la Aplicación

Abre tu navegador:
- **Frontend**: http://tu-ip-vps
- **Admin**: http://tu-ip-vps/admin
- **API**: http://tu-ip-vps/api

## 🔒 Configurar SSL con Let's Encrypt (Recomendado)

### 1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Detener Nginx temporalmente

```bash
docker-compose -f docker-compose.prod.yml stop nginx
```

### 3. Obtener Certificados

```bash
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com --email tu-email@example.com --agree-tos
```

### 4. Copiar Certificados

```bash
# Crear directorio para SSL
mkdir -p nginx/ssl

# Copiar certificados
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem nginx/ssl/

# Cambiar permisos
sudo chown $USER:$USER nginx/ssl/*
chmod 644 nginx/ssl/*.pem
```

### 5. Actualizar Configuración de Nginx

Edita `nginx/prod.conf` y descomenta las líneas de SSL:

```nginx
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
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... resto de configuración
}
```

### 6. Reiniciar Nginx

```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

### 7. Renovación Automática

```bash
# Agregar cron job para renovación
sudo crontab -e

# Agregar esta línea (renueva diariamente a las 3 AM)
0 3 * * * certbot renew --quiet && docker-compose -f /opt/snies/docker-compose.prod.yml restart nginx
```

## 🔄 Updates y Mantenimiento

### Actualizar la Aplicación

```bash
cd /opt/snies

# Obtener últimos cambios
git pull origin main

# Ejecutar deployment
./scripts/deploy.sh
```

### Ver Logs

```bash
# Todos los logs
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Backup de Base de Datos

```bash
# Crear backup
docker-compose -f docker-compose.prod.yml exec db pg_dump -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose -f docker-compose.prod.yml exec -T db psql -U $DB_USER $DB_NAME < backup_file.sql
```

### Reiniciar Servicios

```bash
# Todos los servicios
docker-compose -f docker-compose.prod.yml restart

# Servicio específico
docker-compose -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📊 Monitoreo

### Ver Uso de Recursos

```bash
# CPU y Memoria de contenedores
docker stats

# Espacio en disco
df -h
docker system df
```

### Health Checks

```bash
# Backend health
curl http://localhost/health/

# Check de servicios
docker-compose -f docker-compose.prod.yml ps
```

## 🐛 Solución de Problemas

### Los contenedores no inician

```bash
# Ver logs de error
docker-compose -f docker-compose.prod.yml logs

# Verificar .env
cat .env | grep -v "^#" | grep -v "^$"

# Reiniciar desde cero
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

### Error 502 Bad Gateway

```bash
# Verificar que backend esté corriendo
docker-compose -f docker-compose.prod.yml ps backend

# Ver logs del backend
docker-compose -f docker-compose.prod.yml logs backend

# Verificar nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Base de datos no conecta

```bash
# Verificar que PostgreSQL esté corriendo
docker-compose -f docker-compose.prod.yml ps db

# Ver logs de la BD
docker-compose -f docker-compose.prod.yml logs db

# Verificar conexión desde backend
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

### Espacio en disco lleno

```bash
# Limpiar imágenes no usadas
docker system prune -a

# Limpiar volúmenes no usados
docker volume prune

# Ver uso de espacio
docker system df
```

## 🔐 Seguridad

### Checklist de Seguridad

- [ ] Contraseñas seguras en .env
- [ ] SECRET_KEY único y seguro
- [ ] DEBUG=False en producción
- [ ] SSL/HTTPS configurado
- [ ] Firewall habilitado
- [ ] SSH con llaves (no password)
- [ ] Backups automáticos configurados
- [ ] Logs monitoreados
- [ ] Actualizaciones regulares

### Hardening Adicional

```bash
# Cambiar puerto SSH (opcional)
sudo nano /etc/ssh/sshd_config
# Port 2222

# Deshabilitar root login
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no

# Reiniciar SSH
sudo systemctl restart sshd

# Actualizar firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose -f docker-compose.prod.yml logs -f`
2. Verifica variables de entorno
3. Consulta esta documentación
4. Abre un issue en GitHub

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)

---

**Última actualización**: 2026-01-30
