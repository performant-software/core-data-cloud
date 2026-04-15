// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import ItemHeader from '../components/ItemHeader';
import usePermissions from '../hooks/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import { type User as UserType } from '../types/User';
import UserEditMenu from '../components/UserEditMenu';
import UserForm from '../components/UserForm';
import UserPassword from '../components/UserPassword';
import UserUtils from '../utils/User';
import UsersService from '../services/Users';
import { useTranslation } from 'react-i18next';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserType,
  isNew?: boolean
};

const User = (props: Props) => {
  const { t } = useTranslation();
  const { canEditUsers, isSSO } = usePermissions();

  const editPageProps = useReactRouterEditPage({
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
    validate: (user) => {
      if (user.id && (user.password || user.password_confirmation)) {
        return UserUtils.validatePassword(user);
      }
      return null;
    }
  });

  const { item } = editPageProps;
  const isNew = props.isNew || !item.id;

  if (!canEditUsers()) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ItemHeader
        back={{
          label: t('User.labels.allUsers'),
          url: '/users'
        }}
        name={isNew ? t('User.labels.inviteUser') : item.name}
      />
      <UserEditMenu />
      <SimpleEditPage
        {...props}
        {...editPageProps}
      >
        <SimpleEditPage.Tab
          key='default'
        >
          <UserForm
            {...props}
            {...editPageProps}
            isNew={isNew}
          />
          { !isNew && !isSSO() && (
            <UserPassword
              {...props}
              {...editPageProps}
            />
          )}
        </SimpleEditPage.Tab>
      </SimpleEditPage>
    </>
  );
};

export default User;
