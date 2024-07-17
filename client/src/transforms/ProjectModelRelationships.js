// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import { UserDefinedFieldsTransform } from '@performant-software/user-defined-fields';
import _ from 'underscore';
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
      'primary_model_id',
      'related_model_id',
      'name',
      'multiple',
      'allow_inverse',
      'inverse_name',
      'inverse_multiple',
      'order',
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
    return {
      [collection]: _.map(projectModel[collection], (item) => ({
        ..._.pick(item, this.getPayloadKeys()),
        ...UserDefinedFieldsTransform.toPayload(item)
      }))
    };
  }
}

const ProjectModelRelationshipsTransform: ProjectModelRelationships = new ProjectModelRelationships();
export default ProjectModelRelationshipsTransform;
