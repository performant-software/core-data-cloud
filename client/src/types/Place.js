// @flow

export type PlaceLayer = {
  id: number,
  name: string,
  layer_type: string,
  content: any,
  url: string
};

export type PlaceName = {
  id: number,
  name: string,
  primary: boolean
};

export type PlaceGeometry = {
  id: number,
  geometry_json: string
};

export type Place = {
  id: number,
  project_model_id: number,
  name: string,
  uuid: string,
  place_names: Array<PlaceName>,
  place_geometry: PlaceGeometry,
  place_layers: Array<PlaceLayer>
};
