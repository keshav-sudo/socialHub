FROM node:20-alpine3.22  AS builder

WORKDIR /builds

COPY package.json package.json
COPY package-lock.json package-lock.json


RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:20-alpine3.22 AS runner

WORKDIR /app

COPY --from=builder /builds/dist ./dist
COPY --from=builder /builds/node_modules ./node_modules
COPY --from=builder /builds/prisma ./prisma
COPY --from=builder /builds/package.json ./package.json

RUN npx prisma generate


CMD ["npm"  , "start"]