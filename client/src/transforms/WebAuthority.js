// @flow

import { BaseTransform } from '@performant-software/shared-components';
import WebAuthorityUtils from '../utils/WebAuthorities';

/**
 * Class responsible for transforming web_authority records for POST/PUT requests.
 */
class WebAuthority extends BaseTransform {
  /**
   * Returns the web authority parameter name.
   *
   * @returns {string}
   */
  getParameterName() {
    return 'web_authority';
  }

  /**
   * Returns the web authority payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys() {
    return [
      'project_id',
      'source_type',
      'access'
    ];
  }

  /**
   * Returns the passed web authority as a dropdown option.
   *
   * @param authority
   *
   * @returns {{text: *, value, key}}
   */
  toDropdown(authority) {
    return {
      key: authority.id,
      value: authority.id,
      text: WebAuthorityUtils.getSourceView(authority)
    };
  }
}

const WebAuthorityTransform: WebAuthority = new WebAuthority();
export default WebAuthorityTransform;
