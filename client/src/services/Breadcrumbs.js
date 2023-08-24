// @flow

import ProjectsService from './Projects';
import UsersService from './Users';

const Services = {
  projects: 'projects',
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
