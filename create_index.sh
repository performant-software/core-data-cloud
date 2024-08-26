#!/bin/bash
until curl -s -f -o /dev/null "http://localhost:8108/health"
do
  echo "***** waiting for typesense *****"
  sleep 5
done
echo "***** create index *****"
bundle exec rake core_data_cloud:create_search_index
echo "***** enable crontab *****"
bundle exec whenever --update-crontab
echo "***** index created *****"