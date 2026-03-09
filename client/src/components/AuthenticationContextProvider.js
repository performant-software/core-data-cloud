// @flow
import { BaseService } from '@performant-software/shared-components';
import { useAuth } from '@clerk/react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthenticationContext, LocalAuthenticationContext } from '../context/Authentication';
import _ from 'underscore';
import SessionService from '../services/Session';
import UsersService from '../services/Users';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

/**
 * Transforms the Clerk auth data into the same format as username/password auth data.
 * @type {function(*): {authenticated: *, user: *}}
 */
const transformClerkData  = (auth, user) => {
  return {
    authenticated: auth.isSignedIn,
    logout: auth.signOut,
    user: {
      ...user,
      role: user?.publicMetadata?.role
    }
  }
}

const AuthenticationContextProvider = (props: any) => {
  const clerkAuth = useAuth();
  const [clerkUser, setClerkUser] = useState(null);
  const localData = useContext(LocalAuthenticationContext);

  /**
   * Block the initial render so the useEffect has a chance to set up the axios interceptor.
   */
  const [ready, setReady] = useState(false);

  /**
   * Call the /me endpoint to get the current user's data.
   */
  useEffect(() => {
    if (PROVIDER === 'clerk' && clerkAuth.isLoaded && !clerkUser) {
      UsersService.getMe().then(res => setClerkUser(res.data));
    }
  }, [clerkAuth.isLoaded]);

  const data = useMemo(() => {
    if (PROVIDER === 'clerk') {
      return transformClerkData(clerkAuth, clerkUser);
    } else {
      return localData;
    }
  }, [clerkAuth, clerkUser, localData]);

  const axiosConfigId = useRef();

  /**
   * Sets the authentication token as a request header on all API services.
   */
  useEffect(() => {
    BaseService.configure((axios) => {
      if (axiosConfigId.current) {
        axios.interceptors.request.eject(axiosConfigId.current);
      }

      axiosConfigId.current = axios.interceptors.request.use(async (config) => {
        let token

        if (PROVIDER === 'local') {
          token = SessionService.getSession()?.token
        } else {
          token = await clerkAuth.getToken();
        }

        _.extend(config.headers, { Authorization: `Bearer ${token}` });

        return config;
      }, (error) => Promise.reject(error));
    });

    const clerkReady = clerkAuth.isLoaded;
    const localReady = PROVIDER === 'local' && SessionService.getSession()?.token;

    if (clerkReady || localReady) {
      setReady(true);
    }
  }, [data, clerkAuth.isLoaded]);

  return (
    <AuthenticationContext.Provider
      value={{ ...data, provider: PROVIDER }}
    >
      { ready && props.children }
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider;
