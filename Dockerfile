FROM alpine:edge AS base
# install node
RUN apk add --no-cache nodejs npm tini
# set working directory
WORKDIR /var/www
# Set tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
# copy project file
COPY package.json .
COPY pnpm-lock.yaml .

# ---- Build Phase ----
FROM base AS build
# install pnpm just for build process
# later we only need npm in release phase
RUN npm install -g pnpm
# install node packages
RUN pnpm i
# build app
COPY . .


RUN pnpm prisma:generate
RUN pnpm build
RUN pnpm prune --prod

# ---- Release Phase ----
FROM base AS release
# copy app config
COPY .env.example .env
# copy production node_modules
COPY --from=build /var/www/node_modules node_modules
# copy app dist build
COPY --from=build /var/www/dist dist
# expose port and define CMD
EXPOSE 3030:3030

CMD ["npm", "run", "prod"]

