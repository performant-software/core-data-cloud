// @flow

import { useContext, useMemo } from 'react';
import _ from 'underscore';
import DateTimeUtils from '../utils/DateTime';
import type { Ownable as OwnableType } from '../types/Ownable';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import type { User as UserType } from '../types/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserRoles from '../utils/UserRoles';
import { AuthenticationContext } from '../context/Authentication';

/**
 * Custom hook for permissions business logic.
 */
const usePermissions = () => {
  const { user } = useContext(AuthenticationContext);

  /**
   * Returns a reference to the currently logged in user.
   *
   * @returns {User}
   */
  const getUser = (): UserType => user;

  /**
   * Returns the user project records for the current user.
   *
   * @returns {Array<UserProject>}
   */
  const getUserProjects = (): Array<UserProjectType> => {
    const { user_projects: userProjects } = user || {};
    return userProjects;
  };

  /**
   * Returns the user project record for the project with the passed ID for the current user.
   *
   * @param projectId
   *
   * @returns {*}
   */
  const getUserProject = (projectId: number): UserProjectType => {
    const userProjects = getUserProjects();
    return _.findWhere(userProjects, { project_id: projectId });
  };

  /**
   * Returns true if the current user has the "admin" role.
   *
   * @returns {boolean}
   */
  const isAdmin = (): boolean => UserRoles.isAdmin(getUser());

  /**
   * Returns true if the current user has the "guest" role.
   *
   * @returns {boolean}
   */
  const isGuest = (): boolean => UserRoles.isGuest(getUser());

  /**
   * Returns true if the current user has the "member" role.
   *
   * @returns {boolean}
   */
  const isMember = (): boolean => UserRoles.isMember(getUser());

  /**
   * Returns true if the passed project is archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const isArchived = (projectId: number): boolean => {
    const userProject = getUserProject(projectId);
    return userProject?.project?.archived;
  };

  /**
   * Returns true if the current user has the editor role in the passed project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const isEditor = (projectId: number): boolean => {
    const userProject = getUserProject(projectId);
    return UserProjectRoles.isEditor(userProject);
  };

  /**
   * Returns true if the current user is the owner of the passed project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const isOwner = (projectId: number): boolean => {
    const userProject = getUserProject(projectId);
    return UserProjectRoles.isOwner(userProject);
  };

  /**
   * An admin user can archive a project.
   *
   * @returns {boolean}
   */
  const canArchiveProject = (): boolean => isAdmin();

  /**
   * An admin user can manage jobs.
   *
   * @returns {boolean}
   */
  const canCreateJobs = (): boolean => isAdmin();

  /**
   * An admin user or a member user can create a new project.
   *
   * @returns {boolean}
   */
  const canCreateProject = (): boolean => isAdmin() || isMember();

  /**
   * An admin user or project owner can delete a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const canDeleteProject = (projectId: number): boolean => {
    // If we're adding a new project, it cannot yet be deleted
    if (!projectId) {
      return false;
    }

    return isAdmin() || (isOwner(projectId) && !isArchived(projectId));
  };

  /**
   * Returns true if the passed record can be deleted.
   *
   * @param projectModel
   * @param record
   *
   * @returns {boolean}
   */
  const canDeleteRecord = (projectModel: ProjectModelType, record: OwnableType): boolean => {
    if (!(projectModel && record)) {
      return false;
    }

    /**
     * Records cannot be deleted from archived projects.
     */
    if (isArchived(projectModel.project_id)) {
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
  };

  /**
   * An admin user can always modify project data. A project owner or editor can modify the project data if the project
   * is not archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const canEditProjectData = (projectId: number): boolean => (
    isAdmin() || ((isOwner(projectId) || isEditor(projectId)) && !isArchived(projectId))
  );

  /**
   * An admin user can always modify project settings. A project owner can modify project settings if the project
   * is not archived.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const canEditProjectSettings = (projectId: number): boolean => {
    // New projects can always be edited
    if (!projectId) {
      return true;
    }

    return isAdmin() || (isOwner(projectId) && !isArchived(projectId));
  };

  /**
   * An admin user or a member user who is a project owner can add users to a project.
   *
   * @param projectId
   *
   * @returns {boolean}
   */
  const canEditUserProjects = (projectId: number): boolean => (
    isAdmin() || (isMember() && isOwner(projectId) && !isArchived(projectId))
  );

  /**
   * Only an admin user can edit users.
   *
   * @returns {boolean}
   */
  const canEditUsers = (): boolean => isAdmin();

  /**
   * Only an admin user can export data.
   *
   * @returns {boolean}
   */
  const canExportData = (): boolean => isAdmin();

  /**
   * An admin user can import data.
   *
   * @returns {boolean}
   */
  const canImportData = (): boolean => isAdmin();

  /**
   * An admin user can always invite user projects. A non-admin user can invite user projects if they have
   * permission to edit users in the project, the user has not yet logged in, and the user has not been invited in
   * the last 24 hours.
   *
   * @param userProject
   *
   * @returns {boolean}
   */
  const canInviteUserProject = (userProject: UserProjectType): boolean => {
    // Admin users can always invite users
    if (isAdmin()) {
      return true;
    }

    // The current user must be able to edit users in the current project
    if (!canEditUserProjects(userProject.project_id)) {
      return false;
    }

    // The user cannot be invited if they have already signed in
    if (userProject.user.last_sign_in_at) {
      return false;
    }

    // The user cannot be invited more than once in 24 hours
    const timeInHours = DateTimeUtils.getDurationInHours(userProject?.user?.last_invited_at);
    const interval = parseInt(import.meta.env.VITE_POSTMARK_INTERVAL, 10);

    return timeInHours > interval;
  };

  /**
   * An admin user and a user who does not log in via SSO can change their password.
   *
   * @returns {boolean}
   */
  const canResetPassword = () => isAdmin() || !user?.sso;

  return useMemo(() => ({
    canArchiveProject,
    canCreateJobs,
    canCreateProject,
    canDeleteProject,
    canDeleteRecord,
    canEditProjectData,
    canEditProjectSettings,
    canEditUserProjects,
    canEditUsers,
    canExportData,
    canImportData,
    canInviteUserProject,
    canResetPassword,
    getUser,
    getUserProject,
    getUserProjects,
    isAdmin,
    isArchived,
    isEditor,
    isGuest,
    isMember,
    isOwner
  }), [user]);
};

export default usePermissions;
