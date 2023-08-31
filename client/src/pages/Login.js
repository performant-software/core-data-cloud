// @flow

import React, { useCallback, useState, type ComponentType } from 'react';
import { LoginModal } from '@performant-software/semantic-components';
import { Navigate } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import styles from './Login.module.css';

const Login: ComponentType<any> = () => {
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState();
  const [error, setError] = useState(false);
  const [password, setPassword] = useState();

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
        onUsernameChange={(e, { value }) => setEmail(value)}
        open
      />
    </div>
  );
};

export default Login;
