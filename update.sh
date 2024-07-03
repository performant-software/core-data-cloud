#!/bin/bash
export BUNDLE_GEMFILE=/app/Gemfile
export BUNDLE_APP_CONFIG=/usr/local/bundle
export RUBY_VERSION=3.2.2
export GEM_HOME=/usr/local/bundle
cd /app
/usr/local/bundle/bin/bundle exec rake typesense:update -- --host=localhost --port=8108 --protocol=http --api-key=TYPESENSE_API_KEY --collection-name=gca
touch /app/cron.log