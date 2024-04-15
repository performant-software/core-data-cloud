// @flow

import { BaseService } from '@performant-software/shared-components';
import WebIdentifierTransform from '../transforms/WebIdentifier';

/**
 * Class responsible for handling all web identifier API requests.
 */
class WebIdentifiers extends BaseService {
  /**
   * Returns the web identifiers base URL.
   *
   * @returns {string}
   */
  getBaseUrl() {
    return '/core_data/web_identifiers';
  }

  /**
   * Returns the web identifier transform object.
   *
   * @returns {WebIdentifier}
   */
  getTransform() {
    return WebIdentifierTransform;
  }
}

const WebIdentifiersService: WebIdentifiers = new WebIdentifiers();
export default WebIdentifiersService;
