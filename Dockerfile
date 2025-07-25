FROM harbor.stageogip.ru/hub/library/node:20-alpine AS build

ARG ENVIRONMENT

WORKDIR /app
COPY . .
RUN npm i lightningcss-linux-x64-musl
RUN npm run build

FROM build AS runner
WORKDIR /app

ENV NODE_ENV=$ENVIRONMENT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY .env.production .

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]