source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby file: '.ruby-version'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 8.1.3'

# Use Postgres as the database for Active Record
gem 'pg', '~> 1.6.3'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 8.0.2'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Json Web Token (JWT) for token based authentication
gem 'jwt', '~> 3.2'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.22'

# Transactional emails
gem 'postmark-rails', '~> 0.22.1'

# CSV processing
gem 'csv', '~> 3.3.5'

# Resource API
gem 'resource_api', git: 'https://github.com/performant-software/resource-api.git', tag: 'v0.5.17'

# Authentication
gem 'jwt_auth', git: 'https://github.com/performant-software/jwt-auth.git', tag: 'v1.0.0'

# Core data
gem 'core_data_connector', git: 'https://github.com/performant-software/core-data-connector.git', tag: 'v0.2.2'

# IIIF
gem 'triple_eye_effable', git: 'https://github.com/performant-software/triple-eye-effable.git', tag: 'v0.2.9'

# User defined fields
gem 'user_defined_fields', git: 'https://github.com/performant-software/user-defined-fields.git', tag: 'v0.1.15'

# Fuzzy dates
gem 'fuzzy_dates', git: 'https://github.com/performant-software/fuzzy-dates.git', tag: 'v0.1.2'

# Email filtering
gem 'mail_safe', '~> 0.3.4', group: [:development, :staging]

# Active storage service
gem 'aws-sdk-s3', '~> 1.225', group: [:production, :staging]
gem 'ostruct', '~> 0.6.3'

# Background jobs
gem 'sidekiq', '~> 8.1.6', group: [:production, :staging]

# Clerk
gem 'clerk-sdk-ruby', '~> 5.1', '>= 5.1.3'

# Dependency auditing
gem 'bundler-audit', '~> 0.9.3'

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', '~> 1.11.0', platforms: %i[ mri windows ]

  # Environment variable management
  gem 'dotenv-rails', '~> 3.2.0'
end
