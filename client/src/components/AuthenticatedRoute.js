// @flow

import React, {
  type ComponentType,
  type Node,
  useCallback,
  useContext
} from 'react';
import { matchPath, Navigate, useLocation } from 'react-router';
import { AuthenticationContext } from '../context/Authentication';
import SessionService from '../services/Session';
import UnauthorizedToaster from './UnauthorizedToaster';

type Props = {
  children: Array<Node>
};

const AuthenticatedRoute: ComponentType<any> = ({ children }: Props) => {
  const { authenticated } = useContext(AuthenticationContext);
  const location = useLocation();

  /**
   * Returns true if the passed path matches the users current location.
   *
   * @type {function(*): boolean}
   */
  const isPath = useCallback((path) => !!matchPath({ path, exact: true }, location.pathname), [location.pathname]);

  /**
   * Navigate to the root route if the user is not authenticated.
   */
  if (!authenticated) {
    return <Navigate to='/' />;
  }

  /**
   * Navigate to the password reset route if the current user is required to change their password.
   */
  if (SessionService.isPasswordChangeRequired() && !(isPath('/password_reset') || isPath('/logout'))) {
    return <Navigate to='/password_reset' />;
  }

  return (
    <>
      { children }
      <UnauthorizedToaster />
    </>
  );
};

export default AuthenticatedRoute;
