// @flow

import _ from 'underscore';
import DateTimeUtils from '../utils/DateTime';
import type { Ownable as OwnableType } from '../types/Ownable';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import SessionService from './Session';
import type { User as UserType } from '../types/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserRoles from '../utils/UserRoles';

/**
 * Class responsible for permissions business logic.
 */
class Permissions {
  /**
   * An admin user or a member user can create a new project.
   *
   * @returns {boolean}
   */
  canCreateProject(): boolean {
    return this.isAdmin() || this.isMember();
  }

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
   * An admin user or a member user who is a project owner can add users to a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditUserProjects(projectId: number): boolean {
    return this.isAdmin() || (this.isMember() && this.isOwner(projectId));
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
   * Only an admin user can export data.
   *
   * @returns {boolean}
   */
  canExportData(): boolean {
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
   * An admin user can always invite user projects. A non-admin user can invite user projects if they have
   * permission to edit users in the project, the user has not yet logged in, and the user has not been invited in
   * the last 24 hours.
   *
   * @param userProject
   *
   * @returns {boolean}
   */
  canInviteUserProject(userProject: UserProjectType): boolean {
    // Admin users can always invite users
    if (this.isAdmin()) {
      return true;
    }

    // The current user must be able to edit users in the current project
    if (!this.canEditUserProjects(userProject.project_id)) {
      return false;
    }

    // The user cannot be invited if they have already signed in
    if (userProject.user.last_sign_in_at) {
      return false;
    }

    // The user cannot be invited more than once in 24 hours
    const timeInHours = DateTimeUtils.getDurationInHours(userProject?.user?.last_invited_at);
    const interval = parseInt(process.env.REACT_APP_POSTMARK_INTERVAL, 10);

    return timeInHours > interval;
  }

  /**
   * An admin user and a user who does not log in via SSO can change their password.
   *
   * @returns {boolean}
   */
  canResetPassword() {
    const user = this.getUser();
    return this.isAdmin() || !user.sso;
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
   * Returns true if the current user has the "admin" role.
   *
   * @returns {boolean}
   */
  isAdmin(): boolean {
    return UserRoles.isAdmin(this.getUser());
  }

  /**
   * Returns true if the current user has the "guest" role.
   *
   * @returns {boolean}
   */
  isGuest(): boolean {
    return UserRoles.isGuest(this.getUser());
  }

  /**
   * Returns true if the current user has the "member" role.
   *
   * @returns {boolean}
   */
  isMember(): boolean {
    return UserRoles.isMember(this.getUser());
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
