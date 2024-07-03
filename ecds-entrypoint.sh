#!/bin/bash
./typesense-server --config=./typesense-server.ini &

# set -e

if [ -f /app/tmp/pids/server.pid ]; then
  rm /app/tmp/pids/server.pid
fi

bundle exec ./bin/rake db:prepare
bundle exec rake typesense:delete -- --host=localhost --port=8108 --protocol=http --api-key=$TYPESENSE_API_KEY --collection-name=gca &
bundle exec rake core_data_cloud:create_index
bundle exec rake core_data_connector:iiif:reset_manifests &
bundle exec puma -C config/puma.rb