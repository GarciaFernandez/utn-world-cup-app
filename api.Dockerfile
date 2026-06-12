FROM node:20-alpine

# Instalamos las dependencias nativas de Linux
RUN apk add --no-cache python3 py3-setuptools make g++ bash sqlite dos2unix

WORKDIR /app

# Copiamos todo el proyecto de Windows para adentro
COPY world-cup-api/ .

# Reparación de carpetas internas de Linux con permisos totales
RUN rm -rf node_modules database && mkdir -p database && chmod 777 database

# Instalamos las dependencias limpias de Linux
RUN npm install --no-audit --no-fund

# Corregimos los saltos de línea de los scripts
RUN dos2unix scripts/*.sh 2>/dev/null || true
RUN chmod +x scripts/*.sh 2>/dev/null || true

EXPOSE 5101

# Antes de arrancar la app, borra el archivo .db residual si existe
CMD ["bash", "-c", "rm -f database/world_cup_api.db && npm run start:debug"]