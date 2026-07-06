FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar únicamente dependencias de producción
RUN npm ci --omit=dev

# Copiar el proyecto
COPY . .

# Crear carpeta para los QR
RUN mkdir -p storage/qr

# Puerto del servicio
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]