// @flow

import { BaseTransform } from '@performant-software/shared-components';
import { UserDefinedFieldsTransform } from '@performant-software/user-defined-fields';

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

  /**
   * Returns the passed project model to send on POST/PUT requests.
   *
   * @param projectModel
   *
   * @returns {*}
   */
  toPayload(projectModel) {
    return super.toPayload(projectModel, {
      ...UserDefinedFieldsTransform.toPayload(projectModel)
    });
  }
}

const ProjectModelTransform: ProjectModel = new ProjectModel();
export default ProjectModelTransform;
