# =========================
# Builder / Dev stage
# =========================
FROM node:24-alpine AS development

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

# =========================
# Production Build stage
# =========================
FROM development AS build

RUN npm run build

# =========================
# Runtime stage (Production only)
# =========================
FROM nginx:alpine-slim AS runtime

WORKDIR /app

COPY --from=build /app/dist/ /usr/share/nginx/html

COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
