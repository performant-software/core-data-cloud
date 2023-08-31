// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Place as PlaceType } from '../types/Place';
import PlaceNames from './PlaceNames';
import ProjectItem from './ProjectItem';

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
   * Returns the place for POST/PUT requests as a plain Javascript object.
   *
   * @param place
   *
   * @returns {*}
   */
  toPayload(place: PlaceType): any {
    return super.toPayload(place, {
      ...ProjectItem.toPayload(place),
      ...PlaceNames.toPayload(place)
    });
  }
}

const PlaceTransform: Place = new Place();
export default PlaceTransform;
