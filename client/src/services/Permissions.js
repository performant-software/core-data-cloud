// @flow

import _ from 'underscore';
import type { Ownable as OwnableType } from '../types/Ownable';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import SessionService from './Session';
import type { User as UserType } from '../types/User';
import type { UserProject } from '../types/UserProject';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserRoles from '../utils/UserRoles';

/**
 * Class responsible for permissions business logic.
 */
class Permissions {
  /**
   * An admin user can archive a project.
   *
   * @returns {boolean}
   */
  canArchiveProject(): boolean {
    return this.isAdmin();
  }

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

    return this.isAdmin() || (this.isOwner(projectId) && !this.isArchived(projectId));
  }

  /**
   * Returns true if the passed record can be deleted.
   *
   * @param projectModel
   * @param record
   *
   * @returns {boolean}
   */
  canDeleteRecord(projectModel: ProjectModelType, record: OwnableType): boolean {
    if (!(projectModel && record)) {
      return false;
    }

    /**
     * Records cannot be deleted from archived projects.
     */
    if (this.isArchived(projectModel.project_id)) {
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
   * An admin user can always modify project data. A project owner or editor can modify the project data if the project
   * is not archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditProjectData(projectId: number): boolean {
    return this.isAdmin() || ((this.isOwner(projectId) || this.isEditor(projectId)) && !this.isArchived(projectId));
  }

  /**
   * An admin user can always modify project settings. A project owner can modify project settings if the project
   * is not archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditProjectSettings(projectId: number): boolean {
    // New projects can always be edited
    if (!projectId) {
      return true;
    }

    return this.isAdmin() || (this.isOwner(projectId) && !this.isArchived(projectId));
  }

  /**
   * An admin user or a member user who is a project owner can add users to a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  canEditUserProjects(projectId: number): boolean {
    return this.isAdmin() || (this.isMember() && this.isOwner(projectId) && !this.isArchived(projectId));
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
   * Returns a reference to the currently logged in user.
   *
   * @returns {User}
   */
  getUser(): UserType {
    const { user } = SessionService.getSession();
    return user;
  }

  /**
   * Returns the user project record for the project with the passed ID for the current user.
   *
   * @param projectId
   *
   * @returns {*}
   */
  getUserProject(projectId: number): UserProject {
    const userProjects = this.getUserProjects();
    return _.findWhere(userProjects, { project_id: projectId });
  }

  /**
   * Returns the user project records for the current user.
   *
   * @returns {Array<UserProject>}
   */
  getUserProjects(): Array<UserProject> {
    const user = this.getUser();
    const { user_projects: userProjects } = user || {};

    return userProjects;
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
   * Returns true if the passed project is archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  isArchived(projectId: number): boolean {
    const userProject = this.getUserProject(projectId);
    return userProject?.project?.archived;
  }

  /**
   * Returns true if the current user has the editor role in the passed project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  isEditor(projectId: number): boolean {
    const userProject = this.getUserProject(projectId);
    return UserProjectRoles.isEditor(userProject);
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
    const userProject = this.getUserProject(projectId);
    return UserProjectRoles.isOwner(userProject);
  }
}

const PermissionsService: Permissions = new Permissions();
export default PermissionsService;
