// @flow

import { BaseTransform } from '@performant-software/shared-components';
import type { Option as OptionType } from '../types/Option';
import type { User as UserType } from '../types/User';

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
    return 'user';
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

  /**
   * Returns the passed user as a dropdown option.
   *
   * @param user
   *
   * @returns {{text: string, value: number, key: number}}
   */
  toDropdown(user: UserType): OptionType {
    return {
      key: user.id,
      value: user.id,
      text: user.name
    };
  }
}

const UserTransform: User = new User();
export default UserTransform;
