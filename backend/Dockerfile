FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM dependencies AS build

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS production-dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json

EXPOSE 4000

CMD ["dist/server.js"]
