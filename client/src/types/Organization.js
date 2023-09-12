// @flow

export type OrganizationName = {
  id: number,
  name: string,
  primary: boolean
};

export type Organization = {
  id: number,
  description: string,
  organization_names: Array<OrganizationName>
};
