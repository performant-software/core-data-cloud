// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';
import type { User } from '../types/User';

type RolesType = {
  [key: string]: {
    label: string,
    value: string
  }
};

const Roles: RolesType = {
  admin: {
    label: i18n.t('UserRoles.labels.admin'),
    value: 'admin'
  },
  guest: {
    label: i18n.t('UserRoles.labels.guest'),
    value: 'guest'
  },
  member: {
    label: i18n.t('UserRoles.labels.member'),
    value: 'member'
  }
};

const getRoleOptions = (): any => _.map(_.keys(Roles), (key) => ({
  key: Roles[key].value,
  value: Roles[key].value,
  text: Roles[key].label
}));

const getRoleView = (value: string): string => {
  const role = _.findWhere(_.values(Roles), { value });
  return role?.label;
};

/**
 * Returns true if the passed user has the passed role.
 *
 * @param user
 * @param role
 *
 * @returns {boolean}
 */
const hasRole = (user: User, role: string) => user?.role === role;

/**
 * Returns true if the passed user has the "admin" role.
 *
 * @param user
 *
 * @returns {boolean}
 */
const isAdmin = (user: User) => hasRole(user, Roles.admin.value);

/**
 * Returns true if the passed user has the "guest" role.
 *
 * @param user
 *
 * @returns {boolean}
 */
const isGuest = (user: User) => hasRole(user, Roles.guest.value);

/**
 * Returns true if the passed user has the "member" role.
 *
 * @param user
 *
 * @returns {boolean}
 */
const isMember = (user: User) => hasRole(user, Roles.member.value);

export default {
  getRoleOptions,
  getRoleView,
  isAdmin,
  isGuest,
  isMember,
  Roles
};
