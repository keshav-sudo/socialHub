FROM node:20-alpine3.22  AS builder

WORKDIR /builds

COPY package.json package.json
COPY package-lock.json package-lock.json


RUN npm install \
    --fetch-retries 5 \
    --fetch-timeout 600000 \
    --fetch-retry-maxtimeout 120000

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production

FROM node:20-alpine3.22 AS runner

WORKDIR /app

COPY --from=builder /builds/dist ./dist
COPY --from=builder /builds/node_modules ./node_modules
COPY --from=builder /builds/prisma ./prisma
COPY --from=builder /builds/package.json ./package.json
COPY --from=builder /builds/generated ./generated


CMD ["npm"  , "start"]