FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci --include=dev

COPY backend ./

RUN npx tsc

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
