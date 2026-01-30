FROM node:20-alpine

WORKDIR /app

# Instala dependencias primero para mejorar caché
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# Variables de entorno para evitar problemas
ENV WATCHPACK_POLLING=false
ENV CHOKIDAR_USEPOLLING=false
ENV NEXT_TELEMETRY_DISABLED=1

# Next dev simple sin flags problemáticos
CMD ["npm", "run", "dev"]

