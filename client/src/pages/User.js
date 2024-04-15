// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import ItemHeader from '../components/ItemHeader';
import { type User as UserType } from '../types/User';
import UserEditMenu from '../components/UserEditMenu';
import UserForm from '../components/UserForm';
import UsersService from '../services/Users';
import { useTranslation } from 'react-i18next';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserType
};

const UserFormComponent = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <ItemHeader
        back={{
          label: t('User.labels.allUsers'),
          url: '/users'
        }}
        name={props.item.name}
      />
      <UserEditMenu />
      <SimpleEditPage
        {...props}
      >
        <SimpleEditPage.Tab
          key='default'
        >
          <UserForm
            {...props}
          />
        </SimpleEditPage.Tab>
      </SimpleEditPage>
    </>
  );
};

const User: AbstractComponent<any> = withReactRouterEditPage(UserFormComponent, {
  id: 'userId',
  onInitialize: (id) => (
    UsersService
      .fetchOne(id)
      .then(({ data }) => data.user)
  ),
  onSave: (user) => (
    UsersService
      .save(user)
      .then(({ data }) => data.user)
  ),
  required: ['name', 'email']
});

export default User;
