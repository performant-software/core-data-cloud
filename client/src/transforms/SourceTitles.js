// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import InstanceType from '../types/Instance';
import ItemType from '../types/Item';
import WorkType from '../types/Work';

/**
 * Class responsible for transforming place names objects.
 */
class SourceTitles extends NestedAttributesTransform {
  /**
   * Returns the source names payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'primary',
      'name',
      'name_id',
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
  toPayload(
    source: InstanceType | ItemType | WorkType,
    collection: string = 'source_titles'
  ): any {
    return super.toPayload(source, collection);
  }
}

const SourceTitlesTransform: SourceTitles = new SourceTitles();
export default SourceTitlesTransform;
