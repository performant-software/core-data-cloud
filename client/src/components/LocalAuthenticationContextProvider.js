// @flow

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Node
} from 'react';
import { LocalAuthenticationContext } from '../context/Authentication';
import LocalAuthenticationService from '../services/LocalAuthentication';
import SessionService from '../services/Session';

type Props = {
  children: Node
};

const LocalAuthenticationContextProvider = (props: Props) => {
  const [authenticated, setAuthenticated] = useState<boolean>(LocalAuthenticationService.isAuthenticated());
  const [user, setUser] = useState<any>(SessionService.getSession().user);

  /**
   * Sets the authenticated and user state from the session.
   */
  const onUpdateSession = useCallback(() => {
    setAuthenticated(LocalAuthenticationService.isAuthenticated());
    setUser(SessionService.getSession().user);
  }, []);

  /**
   * Log in the user with the passed parameters.
   *
   * @type {function(any): Promise<any>}
   */
  const login = useCallback((params: any) => (
    LocalAuthenticationService
      .login(params)
      .then((data) => {
        onUpdateSession();
        return data;
      })
  ), []);

  /**
   * Log out the user.
   *
   * @type {function(): Promise<any>}
   */
  const logout = useCallback(() => (
    LocalAuthenticationService
      .logout()
      .then((data) => {
        onUpdateSession();
        return data;
      })
  ), []);

  /**
   * Update the session on mount.
   */
  useEffect(() => {
    onUpdateSession();
  }, []);

  /**
   * Memoize the value to be set on the context.
   */
  const value = useMemo(() => ({
    authenticated,
    login,
    logout,
    user
  }), [authenticated, login, logout, user]);

  return (
    <LocalAuthenticationContext.Provider
      value={value}
    >
      { props.children }
    </LocalAuthenticationContext.Provider>
  );
};

export default LocalAuthenticationContextProvider;
