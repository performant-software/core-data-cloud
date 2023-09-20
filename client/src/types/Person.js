// @flow

export type PersonName = {
  id: number,
  first_name: string,
  middle_name: string,
  last_name: string,
  primary: boolean
};

export type Person = {
  id: number,
  project_model_id: number,
  biography: string,
  person_names: Array<PersonName>,
  first_name: string,
  middle_name: string,
  last_name: string
};
