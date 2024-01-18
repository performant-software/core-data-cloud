// @flow

import { BaseService } from '@performant-software/shared-components';
import WebAuthorityTransform from '../transforms/WebAuthority';

/**
 * Class responsible for handling all web authorities API requests.
 */
class WebAuthorities extends BaseService {
  /**
   * Returns the web authorities base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/web_authorities';
  }

  /**
   * Returns the web authority transform object.
   *
   * @returns {WebAuthority}
   */
  getTransform() {
    return WebAuthorityTransform;
  }

  /**
   * Calls the /web_authorities/:id/find API endpoint with the passed identifier.
   *
   * @param id
   * @param identifier
   *
   * @returns {*}
   */
  find(id: number, identifier: string) {
    return this.getAxios().get(`${this.getBaseUrl()}/${id}/find`, { params: { identifier } });
  }

  /**
   * Calls the /web_authorities/:id/search API endpoint with the passed identifier.
   *
   * @param id
   * @param query
   *
   * @returns {*}
   */
  search(id: number, query: string) {
    return this.getAxios().get(`${this.getBaseUrl()}/${id}/search`, { params: { query } });
  }
}

const WebAuthoritiesService: WebAuthorities = new WebAuthorities();
export default WebAuthoritiesService;
