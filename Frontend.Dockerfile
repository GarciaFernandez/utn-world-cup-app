FROM node:20-alpine

WORKDIR /app

# Copiamos descriptores e instalamos paquetes
COPY frontend/world-cup-app/package*.json ./
RUN npm install --no-audit --no-fund

# Copiamos el código fuente completo del front
COPY frontend/world-cup-app/ .

# Exponemos el puerto del frontend
EXPOSE 3101

# Comando nativo 
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "3101", "--disable-host-check"]