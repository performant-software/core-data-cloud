// @flow

import ProjectsService from './Projects';
import UserProjectsService from './UserProjects';
import UsersService from './Users';

const Services = {
  projects: 'projects',
  user_projects: 'user_projects',
  users: 'users'
};

type OnLoadType = (name: string, id: number, params?: any) => Promise<any>;

/**
 * Returns a promise to fetch the identifier for the passed name and ID.
 *
 * @param name
 * @param id
 * @param params
 *
 * @returns {*}
 */
const onLoad: OnLoadType = (name: string, id: number, params: any = {}) => {
  let promise;

  switch (name) {
    case Services.projects:
      promise = ProjectsService
        .fetchOne(id)
        .then(({ data }) => data.project?.name);
      break;

    case Services.user_projects:
      promise = UserProjectsService.fetchOne(id).then(({ data }) => (
        params.projectId
          ? data.user_project?.user?.name
          : data.user_project?.project?.name
      ));
      break;

    case Services.users:
      promise = UsersService
        .fetchOne(id).then(({ data }) => data.user?.name);
      break;

    default:
      promise = Promise.resolve();
  }

  return promise;
};

export default {
  onLoad
};

export {
  Services
};
