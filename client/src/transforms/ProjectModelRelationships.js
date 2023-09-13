// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';

/**
 * Class responsible for transforming project model relationships objects.
 */
class ProjectModelRelationships extends NestedAttributesTransform {
  /**
   * Returns the project model relationships payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'id',
      'related_model_id',
      'name',
      'multiple',
      '_destroy'
    ];
  }

  /**
   * Returns the project model relationships for the passed place to be sent on POST/PUT requests.
   *
   * @param projectModel
   * @param collection
   *
   * @returns {*}
   */
  toPayload(projectModel: ProjectModelType, collection: string = 'project_model_relationships') {
    return super.toPayload(projectModel, collection);
  }
}

const ProjectModelRelationshipsTransform: ProjectModelRelationships = new ProjectModelRelationships();
export default ProjectModelRelationshipsTransform;
