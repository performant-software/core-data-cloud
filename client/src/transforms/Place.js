// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Place as PlaceType } from '../types/Place';
import PlaceGeometry from './PlaceGeometry';
import PlaceLayers from './PlaceLayers';
import PlaceNames from './PlaceNames';

/**
 * Class responsible for transforming place records for POST/PUT requests.
 */
class Place extends BaseTransform {
  /**
   * Returns the place parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'place';
  }

  /**
   * Returns the place payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'project_model_id',
      'user_defined'
    ];
  }

  /**
   * Returns the passed place as a dropdown option.
   *
   * @param place
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(place: PlaceType) {
    return {
      key: place.id,
      value: place.id,
      text: place.name
    };
  }

  /**
   * Returns the place for POST/PUT requests as a plain Javascript object.
   *
   * @param place
   *
   * @returns {*}
   */
  toPayload(place: PlaceType): any {
    return super.toPayload(place, {
      ...PlaceNames.toPayload(place),
      ...PlaceGeometry.toPayload(place),
      ...PlaceLayers.toPayload(place)
    });
  }
}

const PlaceTransform: Place = new Place();
export default PlaceTransform;
