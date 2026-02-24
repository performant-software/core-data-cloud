// @flow

import { BaseTransform as APIBase, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import _ from 'underscore';

/**
 * Class responsible for transforming records for merge requests.
 */
class BaseTransform extends APIBase {
  /**
   * Returns a hash of the valid parameters for the manifests endpoint.
   *
   * @param params
   *
   * @returns {*}
   */
  toManifestable(params) {
    return _.pick(params, 'project_model_relationship_id');
  }

  /**
   * Converts the passed item to a mergeable payload by removing any "id" attributes.
   *
   * @param item
   * @param ids
   *
   * @returns {{[p: string]: *, ids: Array<number>}}
   */
  toMergeable(item: any, ids: Array<number>) {
    return {
      [this.getParameterName()]: ObjectUtils.without(item, 'id'),
      ids
    };
  }
}

export default BaseTransform;
