// @flow

import { BaseService } from '@performant-software/shared-components';
import SessionService from './Session';
import UserProjectTransform from '../transforms/UserProject';
import type { UserProject as UserProjectType } from '../types/UserProject';

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

  /**
   * Overrides the parent save method to reset the session user.
   *
   * @param userProject
   *
   * @returns {*}
   */
  save(userProject: UserProjectType): Promise<any> {
    return super
      .create(userProject)
      .then((response) => SessionService.reset().then(() => response));
  }
}

const UserProjectsService: UserProjects = new UserProjects();
export default UserProjectsService;
