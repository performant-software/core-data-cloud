// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';

/**
 * Class responsible for transforming project model access objects.
 */
class ProjectModelAccesses extends NestedAttributesTransform {
  /**
   * Returns the project model accesses payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'project_id',
      '_destroy'
    ];
  }

  /**
   * Returns the project model access for the passed project model to be sent on POST/PUT requests.
   *
   * @param projectModel
   * @param collection
   *
   * @returns {*}
   */
  toPayload(projectModel: ProjectModelType, collection: string = 'project_model_accesses'): any {
    return super.toPayload(projectModel, collection);
  }
}

const ProjectModelAccessesTransform: ProjectModelAccesses = new ProjectModelAccesses();
export default ProjectModelAccessesTransform;
