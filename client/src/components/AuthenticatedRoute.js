// @flow

import React, { type ComponentType, type Node, useCallback } from 'react';
import { matchPath, Navigate, useLocation } from 'react-router-dom';
import AuthenticationService from '../services/Authentication';
import SessionService from '../services/Session';

type Props = {
  children: Array<Node>
};

const AuthenticatedRoute: ComponentType<any> = ({ children }: Props) => {
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
  if (!AuthenticationService.isAuthenticated()) {
    return <Navigate to='/' />;
  }

  /**
   * Navigate to the password reset route if the current user is required to change their password.
   */
  if (SessionService.isPasswordChangeRequired() && !(isPath('/password_reset') || isPath('/logout'))) {
    return <Navigate to='/password_reset' />;
  }

  return children;
};

export default AuthenticatedRoute;
