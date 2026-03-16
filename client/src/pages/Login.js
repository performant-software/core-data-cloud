// @flow

import React, {
  useContext,
  type ComponentType
} from 'react';
import LocalLoginModal from '../components/LocalLoginModal';
import { Navigate } from 'react-router';
import { AuthenticationContext } from '../context/Authentication';
import styles from './Login.module.css';
import { SignIn } from '@clerk/react';

const Login: ComponentType<any> = () => {
  const { authenticated, provider } = useContext(AuthenticationContext);

  if (authenticated) {
    return <Navigate to='/projects' />;
  }

  return (
    <div
      className={styles.login}
    >
      { provider === 'local' && (
        <LocalLoginModal
          open
        />
      )}
      { provider === 'clerk' && (
        <SignIn />
      )}
    </div>
  );
};

export default Login;
