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
   * Calls the <code>/projects/:id/clear</code> API endpoint to clear all data from the passed project.
   *
   * @param project
   *
   * @returns {*}
   */
  clear(project: ProjectType): Promise<any> {
    return this.getAxios().post(`${this.getBaseUrl()}/${project.id}/clear`);
  }

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
    return '/core_data/projects';
  }

  /**
   * Returns the project transform object.
   *
   * @returns {Project}
   */
  getTransform(): typeof ProjectTransform {
    return ProjectTransform;
  }

  /**
   * Imports the passed file.
   *
   * @param id
   * @param file
   *
   * @returns {*}
   */
  import(id: number, file: File) {
    const config = this.getConfig();
    const transform = this.getTransform();
    const payload = transform.toImport(file);

    return this.getAxios().post(`${this.getBaseUrl()}/${id}/import`, payload, config);
  }
}

const ProjectsService: Projects = new Projects();
export default ProjectsService;
