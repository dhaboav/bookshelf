# =========================
# Builder stage
# =========================
FROM node:24-alpine AS build

WORKDIR /app/frontend

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# =========================
# Runtime stage
# =========================
FROM nginx:alpine-slim AS runtime

COPY --from=build /app/frontend/dist/ /usr/share/nginx/html

COPY ./frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
