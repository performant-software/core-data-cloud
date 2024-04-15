// @flow

import type { ProjectModelAccess } from './ProjectModelAccess';
import type { ProjectModelShare } from './ProjectModelShare';

export type ProjectModelRelationship = {
  id: number,
  primary_model_id: number,
  primary_model: ProjectModel,
  related_model_id: number,
  related_model: ProjectModel,
  name: string,
  multiple: boolean,
  slug: string,
  allow_inverse: boolean,
  inverse_name: string,
  inverse_multiple: boolean,
  inverse: boolean
};

export type ProjectModel = {
  id: number,
  project_id: number,
  name: string,
  name_singular: string,
  model_class: string,
  model_class_view: string,
  slug: string,
  has_shares: boolean,
  allow_identifiers: boolean,
  project_model_relationships: Array<ProjectModelRelationship>,
  inverse_project_model_relationships: Array<ProjectModelRelationship>,
  all_project_model_relationships: Array<ProjectModelRelationship>,
  project_model_accesses: Array<ProjectModelAccess>,
  project_model_shares: Array<ProjectModelShare>
};
