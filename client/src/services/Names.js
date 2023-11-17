// @flow

import { BaseService } from '@performant-software/shared-components';
import NamesTransform from '../transforms/Names';

/**
 * Class responsible for handling all work API requests.
 */
class Names extends BaseService {
  /**
   * Returns the name base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/names';
  }

  /**
   * Returns the name transform object.
   *
   * @returns {NamesTransform}
   */
  getTransform() {
    return NamesTransform;
  }
}

const NamesService: Names = new Names();
export default NamesService;
