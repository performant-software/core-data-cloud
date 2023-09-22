// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming relationship records for POST/PUT requests.
 */
class Relationship extends BaseTransform {
  /**
   * Returns the relationship parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'relationship';
  }

  /**
   * Returns the relationship payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'project_model_relationship_id',
      'primary_record_id',
      'primary_record_type',
      'related_record_id',
      'related_record_type',
      'user_defined'
    ];
  }
}

const RelationshipTransform: Relationship = new Relationship();
export default RelationshipTransform;
