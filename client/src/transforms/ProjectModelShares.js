// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';

/**
 * Class responsible for transforming project model share objects.
 */
class ProjectModelShares extends NestedAttributesTransform {
  /**
   * Returns the project model share payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'project_model_access_id',
      '_destroy'
    ];
  }

  /**
   * Returns the project model share for the passed project model to be sent on POST/PUT requests.
   *
   * @param projectModel
   * @param collection
   *
   * @returns {*}
   */
  toPayload(projectModel: ProjectModelType, collection: string = 'project_model_shares'): any {
    return super.toPayload(projectModel, collection);
  }
}

const ProjectModelSharesTransform: ProjectModelShares = new ProjectModelShares();
export default ProjectModelSharesTransform;
