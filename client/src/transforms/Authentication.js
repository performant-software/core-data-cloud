// @flow

import { BaseTransform } from '@performant-software/shared-components';
import _ from 'underscore';

/**
 * Class responsible for transforming authentication objects.
 */
class Authentication extends BaseTransform {
  /**
   * Returns the authentication payload keys used for PUT/POST requests.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'email',
      'password'
    ];
  }

  /**
   * Returns an object containing only the params specified in the payload keys.
   *
   * @param params
   *
   * @returns {*}
   */
  toPayload(params: any): any {
    return _.pick(params, this.getPayloadKeys());
  }
}

const AuthenticationTransform: Authentication = new Authentication();
export default AuthenticationTransform;
