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
}

const WebAuthoritiesService: WebAuthorities = new WebAuthorities();
export default WebAuthoritiesService;
