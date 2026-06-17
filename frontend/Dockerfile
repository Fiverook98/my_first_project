# Fase di build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:ssr

# Fase di esecuzione
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev
EXPOSE 4000
CMD ["node", "--trace-warnings", "dist/mini-blog/server/server.mjs"]