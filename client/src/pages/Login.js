// @flow

import React, { useCallback, useState, type ComponentType } from 'react';
import LoginModal from '../components/LoginModal';
import { Navigate } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import { useTranslation } from 'react-i18next';
import styles from './Login.module.css';

const SSO_CALLBACK_URL = `\
${process.env.REACT_APP_SSO_BASE_URL}\
/realms/\
${process.env.REACT_APP_SSO_REALM}\
/protocol/openid-connect/auth?client_id=\
${process.env.REACT_APP_SSO_CLIENT}\
&redirect_uri=\
${process.env.REACT_APP_SSO_REDIRECT_URI}\
&response_type=code`;

const Login: ComponentType<any> = () => {
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState();
  const [error, setError] = useState(false);
  const [password, setPassword] = useState();

  const { t } = useTranslation();

  /**
   * Attempts to authenticate then navigates to the admin page.
   *
   * @type {(function(): void)|*}
   */
  const onLogin = useCallback(() => {
    setDisabled(true);

    AuthenticationService
      .login({ email, password })
      .catch(() => setError(true))
      .finally(() => setDisabled(false));
  }, [email, password]);

  const onSSO = useCallback(() => {
    window.location.href = SSO_CALLBACK_URL;
  }, []);

  if (AuthenticationService.isAuthenticated()) {
    return <Navigate to='/projects' />;
  }

  return (
    <div
      className={styles.login}
    >
      <Image
        className={styles.background}
        src='/assets/background.jpg'
      />
      <LoginModal
        disabled={disabled}
        loginFailed={error}
        onLogin={onLogin}
        onPasswordChange={(e, { value }) => setPassword(value)}
        onSSO={onSSO}
        onUsernameChange={(e, { value }) => setEmail(value)}
        open
        placeholder={t('LoginModal.email')}
      />
    </div>
  );
};

export default Login;
