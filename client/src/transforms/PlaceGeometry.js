// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Place as PlaceType } from '../types/Place';
import _ from 'underscore';

/**
 * Class responsible for transforming place geometry records for POST/PUT requests.
 */
class PlaceGeometry extends BaseTransform {
  /**
   * Returns the place geometry parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'place_geometry';
  }

  /**
   * Returns the place geometry payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'id',
      '_destroy'
    ];
  }

  /**
   * Returns the place geometry for the passed place.
   *
   * @param place
   *
   * @returns {{place_geometry: (*&{geometry_json: string})}}
   */
  toPayload(place: PlaceType) {
    const { place_geometry: placeGeometry } = place;

    return {
      [this.getParameterName()]: {
        ..._.pick(placeGeometry, this.getPayloadKeys()),
        geometry_json: JSON.stringify(placeGeometry?.geometry_json)
      }
    };
  }
}

const PlaceGeometryTransform: PlaceGeometry = new PlaceGeometry();
export default PlaceGeometryTransform;
