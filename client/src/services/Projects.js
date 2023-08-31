// @flow

import { BaseService } from '@performant-software/shared-components';
import ProjectTransform from '../transforms/Project';
import type { Project as ProjectType } from '../types/Project';
import SessionService from './Session';

/**
 * Class responsible for handling all project API requests.
 */
class Projects extends BaseService {
  /**
   * Overrides the parent create method to reset the session user.
   *
   * @param project
   *
   * @returns {*}
   */
  create(project: ProjectType): Promise<any> {
    return super
      .create(project)
      .then((response) => SessionService.reset().then(() => response));
  }

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
