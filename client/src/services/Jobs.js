// @flow

import { BaseService } from '@performant-software/shared-components';
import type { Job as JobType } from '../types/Job';

/**
 * Class responsible for handling all jobs API requests.
 */
class Jobs extends BaseService {
  /**
   * Not implemented.
   *
   * @param job
   *
   * @returns {Promise<*>}
   */
  create(job: JobType): Promise<any> {
    return Promise.reject(job);
  }

  /**
   * Not implemented.
   *
   * @param id
   *
   * @returns {Promise<*>}
   */
  fetchOne(id: number): Promise<any> {
    return Promise.reject(id);
  }

  /**
   * Returns the jobs base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/jobs';
  }

  /**
   * Not implemented.
   *
   * @param job
   *
   * @returns {Promise<*>}
   */
  save(job: JobType): Promise<any> {
    return Promise.reject(job);
  }

  /**
   * Not implemented.
   *
   * @param job
   *
   * @returns {Promise<*>}
   */
  update(job: JobType): Promise<any> {
    return Promise.reject(job);
  }
}

const JobsService: Jobs = new Jobs();
export default JobsService;
