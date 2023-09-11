// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { Place as PlaceType } from '../types/Place';

/**
 * Class responsible for transforming place names objects.
 */
class PlaceNames extends NestedAttributesTransform {
  /**
   * Returns the place names payload keys.
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
   * Returns the place names for the passed place to be sent on POST/PUT requests.
   *
   * @param place
   * @param collection
   *
   * @returns {*}
   */
  toPayload(place: PlaceType, collection: string = 'place_names'): any {
    return super.toPayload(place, collection);
  }
}

const PlaceNamesTransform: PlaceNames = new PlaceNames();
export default PlaceNamesTransform;
