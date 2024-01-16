// @flow

import type { Project as ProjectType } from './Project';

export type WebAuthority = {
  id: number,
  project_id: number,
  project: ProjectType,
  source_type: string,
  access: { [key: string]: string }
};
