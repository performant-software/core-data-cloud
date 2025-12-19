// @flow

import _ from 'underscore';
import BaseTransform from './Base';
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
   * Converts the passed place to a mergeable payload by transforming the GeoJSON.
   *
   * @param place
   * @param ids
   *
   * @returns {{[p: string]: *, ids: Array<number>}}
   */
  toMergeable(place: PlaceType, ids: Array<number>) {
    const mergeable = super.toMergeable(place, ids);

    const { place_geometry: geometry } = mergeable.place;

    // Convert the geometry_json to a string
    _.extend(geometry, {
      geometry_json: JSON.stringify(geometry?.geometry_json)
    });

    return mergeable;
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
