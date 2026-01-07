FROM node:20.19-alpine AS builder

WORKDIR /code

ARG VITE_HOSTNAME
ARG VITE_IIIF_MANIFEST_ITEM_LIMIT
ARG VITE_MAP_TILER_KEY
ARG VITE_POSTMARK_INTERVAL

COPY client/ .

ARG GENERATE_SOURCEMAP=false
ARG DISABLE_ESLINT_PLUGIN=true

RUN yarn install && yarn build

FROM ruby:3.4.4

RUN apt-get update -qq && apt-get install -y postgresql-client git libvips npm

WORKDIR /app

COPY . .
COPY --from=builder /code/build /app/public

RUN bundle install

# COnfigure some runtime defaults for rails and node
ENV RAILS_ENV=docker
ENV RAILS_LOG_TO_STDOUT=true
ENV RAILS_SERVE_STATIC_FILES=true
ENV NODE_OPTIONS="--max-old-space-size=16384"

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENTRYPOINT ["/bin/sh", "-c", "./docker-entrypoint.sh"]