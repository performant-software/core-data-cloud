// @flow

import { BaseService as APIBase } from '@performant-software/shared-components';

/**
 * Class responsible for handling all merge and manifests API requests.
 */
class BaseService extends APIBase {
  /**
   * Constructs a new BaseService object. This constructor should never be used directly.
   */
  constructor() {
    super();

    if (this.constructor === BaseService) {
      throw new TypeError('Abstract class "BaseService" cannot be instantiated directly.');
    }
  }

  /**
   * Calls the /core_data/<model>/<id>/create_manifests API endpoint.
   *
   * @param id
   * @param params
   *
   * @returns {*}
   */
  createManifests(id, params = {}) {
    const transform = this.getTransform();
    const payload = transform.toManifestable(params);

    return this.getAxios().post(`${this.getBaseUrl()}/${id}/create_manifests`, payload, this.getConfig());
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
    const payload = transform.toMergeable(item, ids);

    return this.getAxios().post(`${this.getBaseUrl()}/merge`, payload, this.getConfig());
  }
}

export default BaseService;
