# Build stage
FROM node:16 AS frontend-build

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .
RUN yarn build

# Production Stage
FROM node:16-alpine

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install --production --frozen-lockfile

COPY --from=frontend-build /app/build/ build
COPY api api

EXPOSE 5000
CMD ["node", "api/server.js"]
