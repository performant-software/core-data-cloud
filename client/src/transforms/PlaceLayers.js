// @flow

import { NestedAttributesTransform } from '@performant-software/shared-components';
import type { Place as PlaceType } from '../types/Place';

/**
 * Class responsible for transforming place layer objects.
 */
class PlaceLayers extends NestedAttributesTransform {
  /**
   * Returns the place names payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'id',
      'name',
      'layer_type',
      'geometry',
      'url',
      '_destroy'
    ];
  }

  /**
   * Returns the place layers for the passed place to be sent on POST/PUT requests.
   *
   * @param place
   * @param collection
   *
   * @returns {*}
   */
  toPayload(place: PlaceType, collection: string = 'place_layers'): any {
    return super.toPayload(place, collection);
  }
}

const PlaceLayersTransform: PlaceLayers = new PlaceLayers();
export default PlaceLayersTransform;
