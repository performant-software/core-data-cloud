// @flow

import _ from 'underscore';
import { Message } from 'semantic-ui-react';
import { BooleanIcon, ListTable, Toaster } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import DateTimeUtils from '../utils/DateTime';
import PermissionsService from '../services/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import UserRoles from '../utils/UserRoles';
import UsersService from '../services/Users';
import Validation from '../utils/Validation';

const Users: AbstractComponent<any> = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Tracks user for invite toaster
   */
  const [invitedUser, setInvitedUser] = useState(null);

  /**
   * Sends an invitation to the passed user.
   *
   * @type {function(*): Promise<void>}
   */
  const onInviteUser = useCallback((user) => (
    UsersService
      .sendInvitation(user)
      .then(() => setInvitedUser(user))
      .catch((e) => setErrors(Validation.resolveDeleteError(e)))
  ), []);

  if (!PermissionsService.canEditUsers()) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ListTable
        actions={[{
          name: 'edit',
          onClick: (item) => navigate(`${item.id}`)
        }, {
          accept: (item) => !item.last_sign_in_at,
          name: 'resend_invite',
          icon: 'mail outline',
          popup: {
            title: t('Users.actions.resendInvite.title'),
            content: t('Users.actions.resendInvite.content')
          },
          onClick: (item) => onInviteUser(item)
        }, {
          name: 'delete'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          content: t('Users.buttons.invite'),
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
      { invitedUser && (
        <Toaster
          onDismiss={() => setInvitedUser(null)}
          type={Toaster.MessageTypes.positive}
        >
          <Message.Header
            content={t('Users.messages.invitation.header')}
          />
          <Message.Content
            content={t('Users.messages.invitation.content', { email: invitedUser.email })}
          />
        </Toaster>
      )}
      { !_.isEmpty(errors) && (
        <Toaster
          onDismiss={() => setErrors(null)}
          timeout={0}
          type={Toaster.MessageTypes.negative}
        >
          <Message.Header
            content={t('Users.messages.invitation.error')}
          />
          <Message.List
            items={errors}
          />
        </Toaster>
      )}
    </>
  );
};

export default Users;
