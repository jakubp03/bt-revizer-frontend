FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.29-alpine AS final

RUN apk add --no-cache openssl

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.d/40-init-certs.sh /docker-entrypoint.d/40-init-certs.sh
COPY docker-entrypoint.d/50-watch-certs.sh /docker-entrypoint.d/50-watch-certs.sh
RUN chmod +x /docker-entrypoint.d/40-init-certs.sh /docker-entrypoint.d/50-watch-certs.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443