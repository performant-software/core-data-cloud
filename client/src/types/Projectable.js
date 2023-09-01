// @flow

import type { Project } from './Project';

export type Projectable = {
  id: number,
  project_item: {
    project_id: number,
    project: Project
  }
};
