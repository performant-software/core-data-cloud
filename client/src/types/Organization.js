// @flow

export type OrganizationName = {
  id: number,
  name: string,
  primary: boolean
};

export type Organization = {
  id: number,
  project_model_id: number,
  description: string,
  name: string,
  uuid: string,
  organization_names: Array<OrganizationName>
};
