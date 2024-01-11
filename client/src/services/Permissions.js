// @flow

import _ from 'underscore';
import type { User as UserType } from '../types/User';
import type { Ownable as OwnableType } from '../types/Ownable';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
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
   * Returns true if the passed record can be deleted.
   *
   * @param projectModel
   * @param record
   *
   * @returns {boolean}
   */
  canDeleteRecord(projectModel: ProjectModelType, record: OwnableType) {
    if (!(projectModel && record)) {
      return false;
    }

    /**
     * If the current record is shared by another model, it cannot be deleted.
     */
    if (projectModel.id !== record.project_model_id) {
      return false;
    }

    /**
     * If the current model is shared with another project, records cannot be deleted.
     */
    if (!_.isEmpty(projectModel.project_model_accesses)) {
      return false;
    }

    return true;
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
   * An admin user can import data.
   *
   * @returns {boolean}
   */
  canImportData(): boolean {
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
