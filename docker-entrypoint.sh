#!/bin/sh

set -e

if [ -f /app/tmp/pids/server.pid ]; then
  rm /app/tmp/pids/server.pid
fi

bundle exec ./bin/rake db:prepare
bundle exec puma -C config/puma.rb