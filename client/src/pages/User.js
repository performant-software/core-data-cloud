// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import PermissionsService from '../services/Permissions';
import { type User as UserType } from '../types/User';
import UserForm from '../components/UserForm';
import UsersService from '../services/Users';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserType
};

const UserFormComponent = (props: Props) => (
  <SimpleEditPage
    {...props}
    editable={PermissionsService.canEditUsers()}
    menuProps={{
      text: true
    }}
  >
    <SimpleEditPage.Tab
      key='default'
    >
      <UserForm
        {...props}
      />
    </SimpleEditPage.Tab>
  </SimpleEditPage>
);

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
