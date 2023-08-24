// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming user records for POST/PUT requests.
 */
class User extends BaseTransform {
  /**
   * Returns the user parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'user'
  }

  /**
   * Returns the user payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'name',
      'email',
      'admin',
      'password',
      'password_confirmation'
    ];
  }
}

const UserTransform: User = new User();
export default UserTransform;
