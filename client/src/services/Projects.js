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
   * Calls the /projects/:id/export_configuration API endpoint.
   *
   * @param id
   *
   * @returns {*}
   */
  exportConfiguration(id: number): Promise<any> {
    return this.getAxios().get(`${this.getBaseUrl()}/${id}/export_configuration`);
  }

  /**
   * Calls the /projects/:id/export_variables API endpoint.
   *
   * @param id
   *
   * @returns {*}
   */
  exportVariables(id: number): Promise<any> {
    return this.getAxios().get(`${this.getBaseUrl()}/${id}/export_variables`);
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
   * Calls the /projects/:id/import_configuration API endpoint with the passed file.
   *
   * @param id
   * @param file
   *
   * @returns {*}
   */
  importConfiguration(id: number, file: File): Promise<any> {
    return this.import(id, file, 'import_configuration');
  }

  /**
   * Calls the /projects/:id/import_data API endpoint with the passed file.
   *
   * @param id
   * @param file
   *
   * @returns {*}
   */
  importData(id: number, file: File) {
    return this.import(id, file, 'import_data');
  }

  // private

  /**
   * Helper function to call the import API endpoints with the passed file.
   *
   * @param id
   * @param file
   * @param route
   *
   * @returns {*}
   */
  import(id: number, file: File, route) {
    const config = this.getConfig();
    const transform = this.getTransform();
    const payload = transform.toImport(file);

    return this.getAxios().post(`${this.getBaseUrl()}/${id}/${route}`, payload, config);
  }
}

const ProjectsService: Projects = new Projects();
export default ProjectsService;
