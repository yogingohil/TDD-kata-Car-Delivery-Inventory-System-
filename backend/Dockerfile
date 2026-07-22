FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci --include=dev
RUN cd backend && npm ci --include=dev

COPY . .

RUN cd backend && npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "backend/dist/server.js"]
