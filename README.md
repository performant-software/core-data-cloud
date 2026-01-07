# core-data-cloud

## Requirements

- macOS or Linux
- Ruby version that matches the `.ruby-version` file. ([rbenv](https://github.com/rbenv/rbenv) is recommended for managing Ruby versions)
- Node 20.19 ([nvm](https://github.com/nvm-sh/nvm) is likewise recommended)
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

### Flow
To install Flow types run `yarn flow-typed install`. To run Flow server run `yarn flow`.

**Note:** Currently, Flow is throwing errors for most files. Instead of updating these all at once, we should fix the Flow errors as other changes are made to the files. Eventually, we should convert this code-base to Typescript.

## Docker

### Prerequisites

#### Required: S3 (AWS)
The default Docker setup requires an S3 bucket for storage. 
Make sure the bucket already exists and the credentials have permission to read/write to it.

#### Required: MapTiler API Key
Map rendering requires a MapTiler Cloud API key. You can obtain a testing key by following the MapTiler docs:
https://docs.maptiler.com/cloud/api/authentication-key/#get-a-testing-key

#### Optional: IIIF Cloud
IIIF Cloud is only required for IIIF-related functionality. The app can start without IIIF configured, but certain features will not work.

### Running

#### First-time run (recommended)
This starts the database in the background, waits for it to initialize, then starts the app with the required environment variables.

```bash
dc up db -d && \
sleep 35 && \
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
AWS_REGION=${AWS_REGION} \
AWS_BUCKET_NAME=${AWS_BUCKET_NAME} \
VITE_MAP_TILER_KEY=${VITE_MAP_TILER_KEY} \
dc up app
```

**Note:** For a long term solution rename `.env.example` to `.env` to use with the Compose [env_file](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/#use-the-env_file-attribute) attribute

## Production

### Heroku Backups

Use the following command the schedule daily backups in a Heroku environment:

```
heroku pg:backups:schedule DATABASE_URL --at '00:00 America/New_York' --app my-app
```

See Heroku's [retention policy](https://devcenter.heroku.com/articles/heroku-postgres-backups#scheduled-backups-retention-limits) for backups.