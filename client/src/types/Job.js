// @flow

import type { User } from './User';

export type JobStatus = 'initializing' | 'processing' | 'completed' | 'failed';

export type Job = {
  id: number,
  user_id: number,
  job_type: 'import',
  status: JobStatus,
  user: User,
};