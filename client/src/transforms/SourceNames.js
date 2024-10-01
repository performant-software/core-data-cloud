// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { Instance as InstanceType } from '../types/Instance';
import type { Item as ItemType } from '../types/Item';
import type { Work as WorkType } from '../types/Work';

/**
 * Class responsible for transforming place names objects.
 */
class SourceNames extends NestedAttributesTransform {
  /**
   * Returns the source names payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'name',
      'primary',
      '_destroy'
    ];
  }

  /**
   * Returns the source names for the passed place to be sent on POST/PUT requests.
   *
   * @param source
   * @param collection
   *
   * @returns {*}
   */
  toPayload(source: InstanceType | ItemType | WorkType, collection: string = 'source_names'): any {
    return super.toPayload(source, collection);
  }
}

const SourceTitlesTransform: SourceNames = new SourceNames();
export default SourceTitlesTransform;
