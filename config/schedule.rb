# frozen_string_literal: true

set :output, '/app/cron.log'

every 2.hours do
  rake "core_data_cloud:update -- --host=localhost --port=8108 --protocol=http --api-key=#{ENV['TYPESENSE_API_KEY']} --collection-name=gca"
end
