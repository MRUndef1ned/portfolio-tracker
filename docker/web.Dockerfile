FROM node:20-alpine

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9 --activate

CMD ["sh", "-c", "pnpm install && pnpm dev:web --host 0.0.0.0"]
