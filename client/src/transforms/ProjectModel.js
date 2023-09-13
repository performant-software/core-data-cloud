// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming project model records for POST/PUT requests.
 */
class ProjectModel extends BaseTransform {
  /**
   * Returns the project model parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'project_model';
  }

  /**
   * Returns the project model payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'project_id',
      'name',
      'model_class'
    ];
  }
}

const ProjectModelTransform: ProjectModel = new ProjectModel();
export default ProjectModelTransform;
