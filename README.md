# FairData

## Requirements

- macOS or Linux
- Ruby version that matches the `.ruby-version` file. ([rbenv](https://github.com/rbenv/rbenv) is recommended for managing Ruby versions)
- Node 24 ([mise](https://mise.jdx.dev/lang/node.html#node)) is likewise recommended)
- Postgres (FairData is confirmed to work with Postgres 18, but any reasonably recent version should work)
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

## Search

Data can be indexed into a Typesense search index using the following commands:

#### Create a new collection
```bash
bundle exec rake typesense:search:create -- -h host -p port -r protocol -a api_key -c collection_name
```

#### Delete a collection
```bash
bundle exec rake typesense:search:delete -- -h host -p port -r protocol -a api_key -c collection_name
```

#### Index documents into a collection
```bash
bundle exec rake typesense:search:index -- -h host -p port -r protocol -a api_key -c collection_name -m model_ids --polygons
```

**Note:** This task expects the entire collection to be indexed. Any records not included in the batch will be removed from the index.

#### Update a collection
```bash
bundle exec rake typesense:search:update -- -h host -p port -r protocol -a api_key -c collection_name
```

**Note:** This task was added as a workaround for an issue in Typesense indexing nested facetable fields using auto-detection schema. This task should be run _after_ the indexing process to update the "facet" attribute on any fields that should be facetable.

## Reconciliation API

### Indexing Data

Data can be indexed into a Typesense search index using the following commands. The search index is used as the data store for results returned from the Reconciliation API.

#### Create a new collection
```bash
bundle exec rake typesense:reconcile:create -- --host=host --port=port --protocol=protocol --api-key=api_key --collection-name=collection_name
```

#### Delete a collection
```bash
bundle exec rake typesense:reconcile:delete -- --host=host --port=port --protocol=protocol --api-key=api_key --collection-name=collection_name
```

#### Index documents into a collection
```bash
bundle exec rake typesense:reconcile:index -- --host=host --port=port --protocol=protocol --api-key=api_key --collection-name=collection_name --project-id=project_id
```

**Note:** This task expects the entire collection to be indexed. Any records not included in the batch will be removed from the index.

### Update Project

In order to make requests to the Reconciliation API, the project record must be updated with Typesense credentials. This can be configured in the project's "Project Settings" form in the FairData user interface. The Typesense API key needs at least `"collections:get"`, `"documents:search"`, and `"documents:get"` permissions.

### Requests

Requests can be made to the Reconciliation API via the following URLs. Follow the [spec](https://www.w3.org/community/reports/reconciliation/CG-FINAL-specs-0.2-20230410/#structure-of-a-reconciliation-query) to see how queries and responses should be structured.

```
GET /core_data/reconcile/projects/:id
```

```
POST /core_data/reconcile/projects/:id
```

The Reconciliation API response for a project includes a `view` property indicating how to structure a view URI. The view URI for an individual record will simply redirect to the CMS edit page for that record:
```
GET /core_data/reconcile/projects/:id/view/:record_id
```

## Public API

In addition to the authenticated API, FairData also provides a public API for the following endpoints:

### Events
```
GET /core_data/public/v1/events/:uuid
GET /core_data/public/v1/events/:uuid/events
GET /core_data/public/v1/events/:uuid/instances
GET /core_data/public/v1/events/:uuid/items
GET /core_data/public/v1/events/:uuid/manifests
GET /core_data/public/v1/events/:uuid/manifests/:uuid
GET /core_data/public/v1/events/:uuid/media_contents
GET /core_data/public/v1/events/:uuid/organizations
GET /core_data/public/v1/events/:uuid/people
GET /core_data/public/v1/events/:uuid/places
GET /core_data/public/v1/events/:uuid/taxonomies
GET /core_data/public/v1/events/:uuid/works
```

### Instances
```
GET /core_data/public/v1/instances/:uuid
GET /core_data/public/v1/instances/:uuid/events
GET /core_data/public/v1/instances/:uuid/instances
GET /core_data/public/v1/instances/:uuid/items
GET /core_data/public/v1/instances/:uuid/manifests
GET /core_data/public/v1/instances/:uuid/manifests/:uuid
GET /core_data/public/v1/instances/:uuid/media_contents
GET /core_data/public/v1/instances/:uuid/organizations
GET /core_data/public/v1/instances/:uuid/people
GET /core_data/public/v1/instances/:uuid/places
GET /core_data/public/v1/instances/:uuid/taxonomies
GET /core_data/public/v1/instances/:uuid/works
```

### Items
```
GET /core_data/public/v1/items/:uuid
GET /core_data/public/v1/items/:uuid/events
GET /core_data/public/v1/items/:uuid/instances
GET /core_data/public/v1/items/:uuid/items
GET /core_data/public/v1/items/:uuid/manifests
GET /core_data/public/v1/items/:uuid/manifests/:uuid
GET /core_data/public/v1/items/:uuid/media_contents
GET /core_data/public/v1/items/:uuid/organizations
GET /core_data/public/v1/items/:uuid/people
GET /core_data/public/v1/items/:uuid/places
GET /core_data/public/v1/items/:uuid/taxonomies
GET /core_data/public/v1/items/:uuid/works
```

### People
```
GET /core_data/public/v1/people/:uuid
GET /core_data/public/v1/people/:uuid/events
GET /core_data/public/v1/people/:uuid/instances
GET /core_data/public/v1/people/:uuid/items
GET /core_data/public/v1/people/:uuid/manifests
GET /core_data/public/v1/people/:uuid/manifests/:uuid
GET /core_data/public/v1/people/:uuid/media_contents
GET /core_data/public/v1/people/:uuid/organizations
GET /core_data/public/v1/people/:uuid/people
GET /core_data/public/v1/people/:uuid/places
GET /core_data/public/v1/people/:uuid/taxonomies
GET /core_data/public/v1/people/:uuid/works
```

### Places
```
GET /core_data/public/v1/places/:uuid
GET /core_data/public/v1/places/:uuid/events
GET /core_data/public/v1/places/:uuid/instances
GET /core_data/public/v1/places/:uuid/items
GET /core_data/public/v1/places/:uuid/manifests
GET /core_data/public/v1/places/:uuid/manifests/:uuid
GET /core_data/public/v1/places/:uuid/media_contents
GET /core_data/public/v1/places/:uuid/organizations
GET /core_data/public/v1/places/:uuid/people
GET /core_data/public/v1/places/:uuid/places
GET /core_data/public/v1/places/:uuid/taxonomies
GET /core_data/public/v1/places/:uuid/works
```

### Works
```
GET /core_data/public/v1/works/:uuid
GET /core_data/public/v1/works/:uuid/events
GET /core_data/public/v1/works/:uuid/instances
GET /core_data/public/v1/works/:uuid/items
GET /core_data/public/v1/works/:uuid/manifests
GET /core_data/public/v1/works/:uuid/manifests/:uuid
GET /core_data/public/v1/works/:uuid/media_contents
GET /core_data/public/v1/works/:uuid/organizations
GET /core_data/public/v1/works/:uuid/people
GET /core_data/public/v1/works/:uuid/places
GET /core_data/public/v1/works/:uuid/taxonomies
GET /core_data/public/v1/works/:uuid/works
```

The following query parameters can be used to further modify the results:

| Parameter   | Description                                      | Required |
|-------------|--------------------------------------------------|----------|
| project_ids | An array of project IDs                          | Yes      |
| search      | Search text used to filter the records           | No       |
| sort_by     | A database colum name to use for sorting records | No       |

## Docker

#### Prerequsites
To run via Docker requires a FairImage instance as well. This can be run as a separate Docker application, or pointed to a FairImage application hosted somewhere else. All that's required is the `IIIF_CLOUD_*` environment variables are set properly and a MapTiler account/API key.

#### Running
To run via a Docker container (for development or production) set your environment variables in `.env`, you can use `.env.example` as a template. If an image has not yet been built, run `docker compose up --build` to build the image and start the container. Subsequent starts of the container can be done with `docker compose up` if no code changes have been made.

## Production

### Heroku Backups

Use the following command the schedule daily backups in a Heroku environment:

```
heroku pg:backups:schedule DATABASE_URL --at '00:00 America/New_York' --app my-app
```

See Heroku's [retention policy](https://devcenter.heroku.com/articles/heroku-postgres-backups#scheduled-backups-retention-limits) for backups.