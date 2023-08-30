// @flow

import _ from 'underscore';
import type { User as UserType } from '../types/User';
import UserProjectRoles from '../utils/UserProjectRoles';

/**
 * Class responsible for permissions business logic.
 */
class Permissions {
  user: UserType | void;

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
   * An admin user or project owner can edit the users associated with a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditUserProjects(projectId: number): boolean {
    if (!projectId) {
      return false;
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
   * Returns true if the current user is an admin.
   *
   * @returns {boolean}
   */
  isAdmin(): boolean {
    return this.user?.admin || false;
  }

  /**
   * Returns true if the current user is the owner of the passed project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  isOwner(projectId: number): boolean {
    const { user_projects: userProjects } = this.user || {};

    return !!_.findWhere(userProjects, {
      project_id: projectId,
      role: UserProjectRoles.Roles.owner.value
    });
  }

  /**
   * Resets the user instance based on local storage.
   *
   * @param user
   */
  reset(user: UserType | void) {
    this.user = user;
  }
}

const PermissionsInstance: Permissions = new Permissions();
export default PermissionsInstance;
