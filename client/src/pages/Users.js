// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UsersService from '../services/Users';

const Users: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
