FROM oven/bun:canary-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN bun i

COPY . .

RUN bun run build

FROM oven/bun:canary-alpine AS runtime

WORKDIR /usr/src/app

RUN apk update && apk upgrade

RUN rm -rf /var/cache/apk/*

COPY --from=build /usr/src/app/dist ./
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 5001

ENTRYPOINT ["/bin/sh", "-c", "bun run server"]
