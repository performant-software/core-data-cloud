// @flow

import { BaseService } from '@performant-software/shared-components';

/**
 * Class responsible for handling all record merge API requests.
 */
class RecordMerges extends BaseService {
  /**
   * Returns the record merge base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/record_merges';
  }

  /**
   * Returns an empty transform object.
   *
   * @returns {{}}
   */
  getTransform() {
    return {};
  }
}

const RecordMergesService: RecordMerges = new RecordMerges();
export default RecordMergesService;
