// @flow

import { BaseService } from '@performant-software/shared-components';
import ProjectModelTransform from '../transforms/ProjectModel';

/**
 * Class responsible for handling all project models API requests.
 */
class ProjectModels extends BaseService {
  fetchModelClasses(params) {
    return this.getAxios().get(`${this.getBaseUrl()}/model_classes`, { params });
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
