// @flow
import { BaseService } from '@performant-software/shared-components';
import { useAuth, useUser } from '@clerk/react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthenticationContext, LocalAuthenticationContext } from '../context/Authentication';
import _ from 'underscore';
import SessionService from '../services/Session';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const AuthenticationContextProvider = (props: any) => {
  const clerkAuth = useAuth();
  const clerkUser = useUser();
  const localData = useContext(LocalAuthenticationContext);

  /**
   * Block the initial render so the useEffect has a chance to set up the axios interceptor.
   */
  const [ready, setReady] = useState(false);

  /**
   * Transforms the Clerk auth data into the same format as username/password auth data.
   * @type {function(*): {authenticated: *, user: *}}
   */
  const transformClerkData  = useCallback((auth, user) => {
    return {
      authenticated: auth,
      user: user
    }
  }, []);

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
        const token = PROVIDER === 'local'
          ? SessionService.getSession()?.token
          : await clerkAuth.getToken();

        _.extend(config.headers, { Authorization: `Bearer ${token}` });

        return config;
      }, (error) => Promise.reject(error));
    });

    setReady(true);
  }, [data]);

  return (
    <AuthenticationContext.Provider
      value={{ ...data, provider: PROVIDER }}
    >
      {ready && props.children }
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider;
