// @flow

import { BaseTransform } from '@performant-software/shared-components';

/**
 * Class responsible for transforming user_project records for POST/PUT requests.
 */
class UserProject extends BaseTransform {
  /**
   * Returns the user_project parameter name.
   *
   * @returns {string}
   */
  getParameterName(): string {
    return 'user_project';
  }

  /**
   * Returns the user payload keys.
   *
   * @returns {string[]}
   */
  getPayloadKeys(): Array<string> {
    return [
      'user_id',
      'project_id',
      'role',
    ];
  }
}

const UserProjectTransform: UserProject = new UserProject();
export default UserProjectTransform;
