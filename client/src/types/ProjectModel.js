// @flow

export type ProjectModelRelationship = {
  id: number,
  primary_model_id: number,
  primary_model: ProjectModel,
  related_model_id: number,
  related_model: ProjectModel,
  name: string,
  multiple: boolean,
  slug: string
};

export type ProjectModel = {
  id: number,
  project_id: number,
  name: string,
  name_singular: string,
  model_class: string,
  model_class_view: string,
  slug: string,
  project_model_relationships: Array<ProjectModelRelationship>
};
