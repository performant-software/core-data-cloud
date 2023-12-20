// @flow

import { BaseService } from '@performant-software/shared-components';

/**
 * Class responsible for handling all name API requests.
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
}

const NamesService: Names = new Names();
export default NamesService;
