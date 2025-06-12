// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import type { UserProject } from '../types/UserProject';

type RolesType = {
  [key: string]: {
    label: string,
    value: string
  }
};

const Roles: RolesType = {
  owner: {
    label: i18n.t('UserProjectRoles.labels.owner'),
    value: 'owner'
  },
  editor: {
    label: i18n.t('UserProjectRoles.labels.editor'),
    value: 'editor'
  }
};

/**
 * Returns the list of role options.
 *
 * @returns {*}
 */
const getRoleOptions = (): any => _.map(_.keys(Roles), (key) => ({
  key: Roles[key].value,
  value: Roles[key].value,
  text: Roles[key].label
}));

/**
 * Returns the label for the passed role value.
 *
 * @param value
 *
 * @returns {*}
 */
const getRoleView = (value: string): string => {
  const role = _.findWhere(_.values(Roles), { value });
  return role?.label;
};

/**
 * Returns true if the passed user project has the passed role.
 *
 * @param userProject
 * @param role
 *
 * @returns {boolean}
 */
const hasRole = (userProject: UserProject, role: string): boolean => userProject?.role === role;

/**
 * Returns true if the passed user project record has the editor role.
 *
 * @param userProject
 *
 * @returns {boolean}
 */
const isEditor = (userProject: UserProject) => hasRole(userProject, Roles.editor.value);

/**
 * Returns true if the passed user project record has the owner role.
 *
 * @param userProject
 *
 * @returns {boolean}
 */
const isOwner = (userProject: UserProject) => hasRole(userProject, Roles.owner.value);

export default {
  Roles,
  getRoleOptions,
  getRoleView,
  isEditor,
  isOwner
};
