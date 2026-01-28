FROM node:20-alpine

WORKDIR /app

# Instala dependencias primero para mejorar caché
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

# Next dev debe escuchar en todas las interfaces dentro del contenedor
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

