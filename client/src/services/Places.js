// @flow

import { BaseService } from '@performant-software/shared-components';
import PlaceTransform from '../transforms/Place';

/**
 * Class responsible for handling all place API requests.
 */
class Places extends BaseService {
  /**
   * Returns the places base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/places';
  }

  /**
   * Returns the place transform object.
   *
   * @returns {User}
   */
  getTransform(): typeof PlaceTransform {
    return PlaceTransform;
  }
}

const PlacesService: Places = new Places();
export default PlacesService;
