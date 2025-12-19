source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby file: '.ruby-version'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 8.0.2'

# Use Postgres as the database for Active Record
gem 'pg', '~> 1.5.9'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 6.6.0'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[ mingw mswin x64_mingw jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Json Web Token (JWT) for token based authentication
gem 'jwt', '~> 3.1.2'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.20'

# Transactional emails
gem 'postmark-rails', '~> 0.22.1'

# CSV processing
gem 'csv', '~> 3.3.5'

# Resource API
gem 'resource_api', git: 'https://github.com/performant-software/resource-api.git', tag: 'v0.5.15'

# Authentication
gem 'jwt_auth', git: 'https://github.com/performant-software/jwt-auth.git', tag: 'v0.1.3'

# Core data
gem 'core_data_connector', git: 'https://github.com/performant-software/core-data-connector.git', tag: 'v0.1.109'

# IIIF
gem 'triple_eye_effable', git: 'https://github.com/performant-software/triple-eye-effable.git', tag: 'v0.2.7'

# User defined fields
gem 'user_defined_fields', git: 'https://github.com/performant-software/user-defined-fields.git', tag: 'v0.1.14'

# Fuzzy dates
gem 'fuzzy_dates', git: 'https://github.com/performant-software/fuzzy-dates.git', tag: 'v0.1.2'

# Email filtering
gem 'mail_safe', '~> 0.3.4', group: [:development, :staging]

# Active storage service
gem 'aws-sdk-s3', '~> 1.193', group: [:production, :staging]

# Background jobs
gem 'sidekiq', '~> 8.0.6', group: [:production, :staging]

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', '~> 1.11.0', platforms: %i[ mri mingw x64_mingw ]

  # Environment variable management
  gem 'dotenv-rails', '~> 3.1.8'
end