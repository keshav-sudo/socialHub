FROM node:20-alpine3.22  AS builder

WORKDIR /builds

COPY package.json package.json
COPY package-lock.json package-lock.json


RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine3.22 AS runner

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 5000

CMD ["npm"  , "start"]