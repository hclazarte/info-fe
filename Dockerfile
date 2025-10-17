# Etapa de build
FROM node:22-alpine AS build
WORKDIR /app

# Copia dependencias e instala
COPY package*.json ./
RUN npm ci

# Copia el resto del código
COPY . .

# Config FE → usa /api (Nginx lo proxyea al BE)
RUN echo '{"apiUrl": "/api"}' > public/config.json

# Build de producción (o dev si así compilas)
RUN npm run build

# Etapa de runtime: Nginx sirviendo estáticos
FROM nginx:1.27-alpine

# Copia el build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx expone 80
EXPOSE 80
