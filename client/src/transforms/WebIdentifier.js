// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming web_identifier records for POST/PUT requests.
 */
class WebIdentifier extends BaseTransform {
  /**
   * Returns the web identifier parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'web_identifier';
  }

  /**
   * Returns the web identifier payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'web_authority_id',
      'identifiable_id',
      'identifiable_type',
      'identifier',
      'extra'
    ];
  }
}

const WebIdentifierTransform: WebIdentifier = new WebIdentifier();
export default WebIdentifierTransform;
