// @flow

import { BooleanIcon, ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import DateTimeUtils from '../utils/DateTime';
import PermissionsService from '../services/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import UserRoles from '../utils/UserRoles';
import UsersService from '../services/Users';

const Users: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!PermissionsService.canEditUsers()) {
    return <UnauthorizedRedirect />;
  }

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (item) => navigate(`${item.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='users'
      columns={[{
        name: 'name',
        label: t('Users.columns.name'),
        sortable: true
      }, {
        name: 'email',
        label: t('Users.columns.email'),
        sortable: true
      }, {
        name: 'role',
        label: t('Users.columns.role'),
        resolve: (user) => UserRoles.getRoleView(user.role),
        sortable: true
      }, {
        name: 'last_sign_in_at',
        label: t('Users.columns.lastSignIn'),
        resolve: (user) => DateTimeUtils.getTimestamp(user.last_sign_in_at),
        sortable: true,
        hidden: true
      }, {
        name: 'last_invited_at',
        label: t('Users.columns.lastInvited'),
        resolve: (user) => DateTimeUtils.getTimestamp(user.last_invited_at),
        sortable: true,
        hidden: true
      }, {
        name: 'required_password_change',
        label: t('Users.columns.passwordChange'),
        render: (user) => (
          <BooleanIcon
            value={user.require_password_change}
          />
        ),
        sortable: true,
        hidden: true
      }]}
      onDelete={(user) => UsersService.delete(user)}
      onLoad={(params) => UsersService.fetchAll(params)}
      searchable
      session={{
        key: 'users',
        storage: localStorage
      }}
    />
  );
};

export default Users;
