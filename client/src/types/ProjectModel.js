// @flow

export type ProjectModelRelationship = {
  id: number,
  primary_model_id: number,
  primary_model: ProjectModel,
  related_model_id: number,
  related_model: ProjectModel,
  name: string,
  multiple: boolean
};

export type ProjectModel = {
  id: number,
  project_id: number,
  name: string,
  model_class: string,
  project_model_relationships: Array<ProjectModelRelationship>
};
