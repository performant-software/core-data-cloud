// @flow

import type { UserProject } from './UserProject';

export type User = {
  id: number,
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
  require_password_change: boolean,
  role: 'admin' | 'member' | 'guest',
  user_projects: Array<UserProject>
};
