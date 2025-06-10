// @flow

import type { UserProject } from './UserProject';

export type User = {
  id: number,
  name: string,
  email: string,
  last_invited_at: number,
  last_sign_in_at: number,
  password: string,
  password_confirmation: string,
  require_password_change: boolean,
  role: 'admin' | 'member' | 'guest',
  user_projects: Array<UserProject>
};
