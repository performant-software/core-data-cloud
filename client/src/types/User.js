// @flow

import type { UserProject } from './UserProject';

export type User = {
  id: number,
  name: string,
  email: string,
  role: 'admin' | 'member' | 'guest',
  user_projects: Array<UserProject>
};
