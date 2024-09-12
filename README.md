# core-data-cloud

## Requirements

- macOS or Linux
- Ruby version that matches the `.ruby-version` file. ([rbenv](https://github.com/rbenv/rbenv) is recommended for managing Ruby versions)
- Node 18 ([nvm](https://github.com/nvm-sh/nvm) is likewise recommended)
- Postgres (this template is confirmed to work with Postgres 18, but any reasonably recent version should work)
- Heroku CLI (optional, if you want to deploy on Heroku)

## Setup

1. Create a Postgres user by running `createuser [username] -d`.
2. Launch `psql` and create a database for your project, and set it to be owned by the user you created in step 1.
3. Create an `.env` file in the root folder of this project, following the format of `.env.example`.
4. For the `SECRET_KEY_BASE` env parameter, you can generate a secure value by running `bundle exec rails secret`.
5. Run `bundle install` to install the gems from the Gemfile.
6. Run `npm run build`, which installs Node dependencies and builds the browser app.
7. Create an app on Heroku.
8. Now you should be able to deploy to Heroku as covered [in their docs](https://devcenter.heroku.com/articles/git).

## Development

Use `bundle exec rake start` to start a live development build.

## Docker

#### Prerequsites
To run via Docker requires a IIIF Cloud instance as well. This can be run as a separate Docker application, or pointed to a IIIF Cloud application hosted somewhere else. All that's required is the `IIIF_CLOUD_*` environment variables are set properly and a MapTiler account/API key.

#### Running
To run via a Docker container (for development or production) set your environment variables in `.env`, you can use `.env.example` as a template. If an image has not yet been built, run `docker compose up --build` to build the image and start the container. Subsequent starts of the container can be done with `docker compose up` if no code changes have been made.
