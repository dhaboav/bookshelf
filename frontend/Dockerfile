# =========================
# Builder stage
# =========================
FROM node:24-alpine AS build

WORKDIR /app/frontend

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend ./

RUN npm run build

# =========================
# Runtime stage
# =========================
FROM node:24-alpine AS runtime

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/frontend/dist ./dist

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173" ]