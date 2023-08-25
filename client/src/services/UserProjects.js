// @flow

import { BaseService } from '@performant-software/shared-components';
import UserProjectTransform from '../transforms/UserProject';

/**
 * Class responsible for handling all user_projects API requests.
 */
class UserProjects extends BaseService {
  /**
   * Returns the user_projects base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/api/user_projects';
  }

  /**
   * Returns the user_projects transform object.
   *
   * @returns {User}
   */
  getTransform(): typeof UserProjectTransform {
    return UserProjectTransform;
  }
}

const UserProjectsService: UserProjects = new UserProjects();
export default UserProjectsService;
