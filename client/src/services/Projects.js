// @flow

import { BaseService } from '@performant-software/shared-components';
import ProjectTransform from '../transforms/Project';

/**
 * Class responsible for handling all project API requests.
 */
class Projects extends BaseService {
  /**
   * Returns the projects base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/api/projects';
  }

  /**
   * Returns the project transform object.
   *
   * @returns {Project}
   */
  getTransform(): typeof ProjectTransform {
    return ProjectTransform;
  }
}

const ProjectsService: Projects = new Projects();
export default ProjectsService;
