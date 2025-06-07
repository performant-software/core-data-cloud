import { SimpleEditPage, Toaster } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageHeader } from 'semantic-ui-react';
import ItemHeader from '../components/ItemHeader';
import PermissionsService from '../services/Permissions';
import SessionService from '../services/Session';
import UserPassword from '../components/UserPassword';
import UsersService from '../services/Users';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

const PasswordResetForm = (props) => {
  const [toaster, setToaster] = useState(SessionService.isPasswordChangeRequired());

  const { t } = useTranslation();
  const { user } = SessionService.getSession();

  /**
   * Memo-izes the "back" url based on whether the user is required to change their password.
   *
   * @type {string}
   */
  const url = useMemo(() => (SessionService.isPasswordChangeRequired() ? '/logout' : '/projects'), []);

  return (
    <>
      <ItemHeader
        back={{
          label: t('PasswordReset.labels.back'),
          url
        }}
        name={user?.name}
      />
      <SimpleEditPage
        {...props}
      >
        <SimpleEditPage.Tab
          key='default'
        >
          <UserPassword
            {...props}
            autoFocus
          />
        </SimpleEditPage.Tab>
      </SimpleEditPage>
      { toaster && (
        <Toaster
          onDismiss={() => setToaster(false)}
          timeout={0}
          type='warning'
        >
          <MessageHeader
            content={t('PasswordReset.messages.required.header')}
          />
          <p>{ t('PasswordReset.messages.required.content') }</p>
        </Toaster>
      )}
    </>
  );
};

const PasswordReset: AbstractComponent<any> = withReactRouterEditPage(PasswordResetForm, {
  afterSave: (navigate) => (
    SessionService
      .reset()
      .then(() => navigate('/projects', { state: { saved: true } }))
  ),
  onSave: (user) => {
    const currentUser = PermissionsService.getUser();
    const { id } = currentUser;

    return UsersService
      .save({ ...user, id })
      .then(({ data }) => data.user);
  },
  required: ['password', 'password_confirmation']
});

export default PasswordReset;
