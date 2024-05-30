// @flow

import { BaseTransform, ObjectJs as ObjectUtils } from '@performant-software/shared-components';

/**
 * Class responsible for transforming records for merge requests.
 */
class MergeableTransform extends BaseTransform {
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

export default MergeableTransform;
