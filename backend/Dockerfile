FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

RUN ./node_modules/.bin/tsc

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
