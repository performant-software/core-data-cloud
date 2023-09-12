// @flow

import OrganizationsService from './Organizations';
import PeopleService from './People';
import PeopleUtils from '../utils/People';
import PlacesService from './Places';
import ProjectsService from './Projects';
import UserProjectsService from './UserProjects';
import UsersService from './Users';

const Services = {
  organizations: 'organizations',
  people: 'people',
  places: 'places',
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
    case Services.organizations:
      promise = OrganizationsService
        .fetchOne(id)
        .then(({ data }) => data.organization?.name);
      break;

    case Services.people:
      promise = PeopleService
        .fetchOne(id)
        .then(({ data }) => PeopleUtils.getNameView(data.person));
      break;

    case Services.places:
      promise = PlacesService
        .fetchOne(id)
        .then(({ data }) => data.place?.name);
      break;

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
