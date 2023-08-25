// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';

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

const getRoleOptions = (): any => _.map(_.keys(Roles), (key) => ({
  key: Roles[key].value,
  value: Roles[key].value,
  text: Roles[key].label
}));

const getRoleView = (value: string): string => {
  const role = _.findWhere(_.values(Roles), { value });
  return role?.label;
};

export default {
  Roles,
  getRoleOptions,
  getRoleView
};
