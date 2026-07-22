FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/

RUN cd backend && npm ci

COPY backend ./backend

WORKDIR /app/backend

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
