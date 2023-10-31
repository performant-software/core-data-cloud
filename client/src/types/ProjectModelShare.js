// @flow

import type { ProjectModel } from './ProjectModel';
import type { ProjectModelAccess } from './ProjectModelAccess';

export type ProjectModelShare = {
  id: number,
  project_model_access_id: number,
  project_model_access: ProjectModelAccess,
  project_model_id: number,
  project_model: ProjectModel
};
