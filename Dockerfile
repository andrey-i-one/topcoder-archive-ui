FROM harbor.stageogip.ru/hub/library/node:20-alpine AS build

ENV ENVIRONMENT=production

WORKDIR /app
COPY . .
RUN npm install -g npm@11.5.1
RUN npm i lightningcss-linux-x64-musl
RUN npm run build
RUN echo ${ENVIRONMENT}

FROM build AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY .env .
COPY .env.production .

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]