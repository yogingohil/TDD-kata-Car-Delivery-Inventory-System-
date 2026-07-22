FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci --include=dev
RUN cd backend && npm ci --include=dev

COPY . .

RUN npm run build:backend

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]
