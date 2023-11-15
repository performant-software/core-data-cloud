// @flow

import { BaseTransform, String } from '@performant-software/shared-components';
import _ from 'underscore';
import type { Relationship as RelationshipType } from '../types/Relationship';

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

  /**
   * Creates a new form data object and appends the passed relationships.
   *
   * @param relationships
   *
   * @returns {FormData}
   */
  toUpload(relationships: Array<RelationshipType>) {
    const formData = new FormData();

    _.each(relationships, (relationship, index) => {
      _.each(this.getPayloadKeys(), (key) => {
        formData.append(`relationships[${index}][${key}]`, String.toString(relationship[key]));
      });
    });

    return formData;
  }
}

const RelationshipTransform: Relationship = new Relationship();
export default RelationshipTransform;
