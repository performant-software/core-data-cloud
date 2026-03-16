import { SimpleEditPage, Toaster } from '@performant-software/semantic-components';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
import { MessageHeader } from 'semantic-ui-react';
import ItemHeader from '../components/ItemHeader';
import usePermissions from '../hooks/Permissions';
import SessionService from '../services/Session';
import UserPassword from '../components/UserPassword';
import UsersService from '../services/Users';
import UserUtils from '../utils/User';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import { AuthenticationContext } from '../context/Authentication';

const PasswordResetForm = (props) => {
  const [toaster, setToaster] = useState(SessionService.isPasswordChangeRequired());

  const { t } = useTranslation();
  const { user } = useContext(AuthenticationContext);
  const { canResetPassword } = usePermissions();

  /**
   * Navigate to the projects list if the current user does not have permissions to reset passwords.
   */
  if (!canResetPassword()) {
    return (
      <Navigate
        replace
        to='/projects'
      />
    );
  }

  return (
    <>
      <ItemHeader
        back={SessionService.isPasswordChangeRequired() ? undefined : {
          label: t('PasswordReset.labels.back'),
          url: '/projects'
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

const PasswordReset = withReactRouterEditPage(PasswordResetForm, {
  afterSave: (navigate) => (
    SessionService
      .reset()
      .then(() => navigate('/projects', { state: { saved: true } }))
  ),
  onSave: (user) => {
    const { user: currentUser } = SessionService.getSession();
    const { id } = currentUser;

    return UsersService
      .save({ ...user, id })
      .then(({ data }) => data.user);
  },
  required: ['password', 'password_confirmation'],
  validate: UserUtils.validatePassword.bind(this)
});

export default PasswordReset;
