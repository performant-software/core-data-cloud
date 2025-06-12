// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import ItemHeader from '../components/ItemHeader';
import PermissionsService from '../services/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import { type User as UserType } from '../types/User';
import UserEditMenu from '../components/UserEditMenu';
import UserForm from '../components/UserForm';
import UserPassword from '../components/UserPassword';
import UserUtils from '../utils/User';
import UsersService from '../services/Users';
import { useTranslation } from 'react-i18next';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserType
};

const UserFormComponent = (props: Props) => {
  const { t } = useTranslation();

  if (!PermissionsService.canEditUsers()) {
    return <UnauthorizedRedirect />;
  }

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
          { !UserUtils.isSingleSignOn(props.item.email) && (
            <UserPassword
              {...props}
            />
          )}
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
  required: ['name', 'email', 'role'],
  validate: UserUtils.validatePassword.bind(this)
});

export default User;
