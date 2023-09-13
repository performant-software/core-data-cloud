// @flow

import _ from 'underscore';
import type { User as UserType } from '../types/User';
import SessionService from './Session';
import UserProjectRoles from '../utils/UserProjectRoles';

/**
 * Class responsible for permissions business logic.
 */
class Permissions {
  /**
   * An admin user or project owner can delete a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canDeleteProject(projectId: number): boolean {
    // If we're adding a new project, it cannot yet be deleted
    if (!projectId) {
      return false;
    }

    return this.isAdmin() || this.isOwner(projectId);
  }

  /**
   * An admin user or project owner can edit a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditProject(projectId: number): boolean {
    // New projects can always be edited
    if (!projectId) {
      return true;
    }

    return this.isAdmin() || this.isOwner(projectId);
  }

  /**
   * Only an admin user can edit users.
   *
   * @returns {boolean}
   */
  canEditUsers(): boolean {
    return this.isAdmin();
  }

  /**
   * Returns a reference to the currently logged in user.
   *
   * @returns {User}
   */
  getUser(): UserType {
    const { user } = SessionService.getSession();
    return user;
  }

  /**
   * Returns true if the current user is an admin.
   *
   * @returns {boolean}
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.admin || false;
  }

  /**
   * Returns true if the current user is the owner of the passed project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  isOwner(projectId: number): boolean {
    const user = this.getUser();
    const { user_projects: userProjects } = user || {};

    return !!_.findWhere(userProjects, {
      project_id: projectId,
      role: UserProjectRoles.Roles.owner.value
    });
  }
}

const PermissionsService: Permissions = new Permissions();
export default PermissionsService;
