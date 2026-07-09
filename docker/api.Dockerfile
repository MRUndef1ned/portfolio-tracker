FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9 --activate

CMD ["sh", "-c", "pnpm install && pnpm dev:api"]
