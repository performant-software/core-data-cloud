// @flow

import type { Project } from './Project';
import type { User } from './User';

export type UserProject = {
  id: number,
  user_id: number,
  user: User,
  project_id: number,
  project: Project,
  role: number
};
