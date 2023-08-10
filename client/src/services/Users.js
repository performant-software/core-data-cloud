// @flow

import { BaseService } from '@performant-software/shared-components';

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
    return '/api/users';
  }
}

const UsersService: Users = new Users();
export default UsersService;
