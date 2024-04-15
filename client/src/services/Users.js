// @flow

import { BaseService } from '@performant-software/shared-components';
import UserTransform from '../transforms/User';

/**
 * Class responsible for handling all users API requests.
 */
class Users extends BaseService {
  /**
   * Returns the users base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/core_data/users';
  }

  /**
   * Returns the user transform object.
   *
   * @returns {User}
   */
  getTransform(): typeof UserTransform {
    return UserTransform;
  }
}

const UsersService: Users = new Users();
export default UsersService;
