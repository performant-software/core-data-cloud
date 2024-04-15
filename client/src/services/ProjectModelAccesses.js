// @flow

import { BaseService } from '@performant-software/shared-components';

/**
 * Class responsible for handling all project model access API requests.
 */
class ProjectModelAccesses extends BaseService {
  /**
   * Returns the project model access base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/project_model_accesses';
  }
}

const ProjectModelAccessesService: ProjectModelAccesses = new ProjectModelAccesses();
export default ProjectModelAccessesService;
