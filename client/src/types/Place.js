// @flow

export type PlaceName = {
  id: number,
  name: string,
  primary: boolean
};

export type Place = {
  id: number,
  project_model_id: number,
  name: string,
  place_names: Array<PlaceName>
};
