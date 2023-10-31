// @flow

import { BaseService } from '@performant-software/shared-components';
import ProjectModelTransform from '../transforms/ProjectModel';

/**
 * Class responsible for handling all project models API requests.
 */
class ProjectModels extends BaseService {
  /**
   * Calls the /model_classes API endpoint.
   *
   * @param params
   *
   * @returns {*}
   */
  fetchModelClasses(params) {
    return this.getAxios().get(`${this.getBaseUrl()}/model_classes`, { params });
  }

  /**
   * Overrides the parent fetchOne function to call the onLoad function in the transform.
   *
   * @param id
   *
   * @returns {Promise<T>}
   */
  fetchOne(id: number) {
    return super.fetchOne(id).then(this.getTransform().onLoad);
  }

  /**
   * Returns the project models base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/project_models';
  }

  /**
   * Returns the project models transform.
   *
   * @returns {ProjectModel}
   */
  getTransform() {
    return ProjectModelTransform;
  }
}

const ProjectModelsService: ProjectModels = new ProjectModels();
export default ProjectModelsService;
