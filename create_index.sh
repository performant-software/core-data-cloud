#!/bin/bash
until curl -s -f -o /dev/null "http://localhost:8108/health"
do
  echo "waiting for typesense"
  sleep 5
done
echo "create index"
bundle exec rake typesense:delete -- --host=localhost --port=8108 --protocol=http --api-key=$TYPESENSE_API_KEY --collection-name=gca
bundle exec rake typesense:create -- --host=localhost --port=8108 --protocol=http --api-key=$TYPESENSE_API_KEY --collection-name=gca
bundle exec rake typesense:index -- --host=localhost --port=8108 --protocol=http --api-key=$TYPESENSE_API_KEY --collection-name=gca --project-models=[1,2,3,4,5,6]
bundle exec rake typesense:update -- --host=localhost --port=8108 --protocol=http --api-key=$TYPESENSE_API_KEY --collection-name=gca
bundle exec rake core_data_cloud:create_search_key
crontab /var/spool/cron/crontabs/root
echo "index created"