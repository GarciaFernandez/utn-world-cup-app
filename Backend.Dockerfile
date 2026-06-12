# --- Etapa 1: Compilación ---
FROM node:20-alpine AS builder

WORKDIR /app

# Buscamos los package de la carpeta del backend
COPY backend/world-cup-core/package*.json ./
RUN npm install --no-audit --no-fund

# Copiamos la app del backend
COPY backend/world-cup-core/ .
RUN npm run build

# --- Etapa 2: Ejecución ---
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY backend/world-cup-core/.env.docker ./.env.docker

ENV NODE_ENV=docker
EXPOSE 4101

CMD ["node", "dist/main"]