// @flow

import type { UserProject } from './UserProject';

export type User = {
  id: number,
  name: string,
  email: string,
  admin: boolean,
  user_projects: Array<UserProject>
};
