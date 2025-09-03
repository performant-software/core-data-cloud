web: bundle exec puma -C config/puma.rb
release: bin/rake db:migrate
worker: bundle exec sidekiq -e production -C config/sidekiq.yml