# Use the Ruby 3.2.2 image from Docker Hub as the base image (https://hub.docker.com/_/ruby)
FROM ruby:3.2.2

RUN apt-get update -qq && apt-get install -y postgresql-client git libvips npm
RUN npm install --global yarn

WORKDIR /app

ARG RAILS_ENV
ARG VITE_HOSTNAME
ARG VITE_IIIF_MANIFEST_ITEM_LIMIT
ARG VITE_MAP_TILER_KEY

# Add Rails gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

RUN bundle install

COPY . .

ENV DISABLE_ESLINT_PLUGIN=true
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=16384"

# Build and deploy React front-end
RUN yarn build && yarn deploy

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*