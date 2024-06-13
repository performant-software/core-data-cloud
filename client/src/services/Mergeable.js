// @flow

import { BaseService } from '@performant-software/shared-components';

/**
 * Class responsible for handling all merge API requests.
 */
class MergeableService extends BaseService {
  /**
   * Constructs a new MergeableService object. This constructor should never be used directly.
   */
  constructor() {
    super();

    if (this.constructor === MergeableService) {
      throw new TypeError('Abstract class "MergeableService" cannot be instantiated directly.');
    }
  }

  /**
   * Calls the /core_data/<model>/merge API endpoint.
   *
   * @param item
   * @param ids
   *
   * @returns {*}
   */
  mergeRecords(item, ids) {
    const transform = this.getTransform();
    return this.getAxios().post(`${this.getBaseUrl()}/merge`, transform.toMergeable(item, ids), this.getConfig());
  }
}

export default MergeableService;
