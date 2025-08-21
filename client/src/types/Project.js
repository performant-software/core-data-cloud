// @flow

export type Project = {
  id: number,
  name: string,
  description: string,
  discoverable: boolean,
  faircopy_cloud_url: string,
  faircopy_cloud_project_model_id: number,
  map_library_url: string,
  archived: boolean,
  reconciliation_credentials: {
    host: string,
    port: string,
    protocol: string,
    api_key: string,
    collection_name: string
  },
  use_storage_key: boolean,
  uuid: string,
};
