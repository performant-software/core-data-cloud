// @flow
import { useAuth } from '@clerk/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthenticationContext, LocalAuthenticationContext } from '../context/Authentication';
import UsersService from '../services/Users';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const AuthenticationContextProvider = (props: any) => {
  const clerkAuth = useAuth();
  const [user, setUser] = useState(null);
  const localData = useContext(LocalAuthenticationContext);

  /**
   * Call the /me endpoint to get the current user's data.
   */
  useEffect(() => {
    if (PROVIDER === 'clerk' && clerkAuth.isSignedIn && !user) {
      UsersService.getMe()
        .then(res => setUser(res.data))
        .catch(() => clerkAuth.signOut());
    }
  }, [clerkAuth.isSignedIn]);

  const data = useMemo(() => {
    if (PROVIDER === 'clerk') {
      return {
        authenticated: clerkAuth.isSignedIn,
        logout: clerkAuth.signOut,
        user
      };
    } else {
      return localData;
    }
  }, [clerkAuth, user, localData]);

  /**
   * Block the initial render so the useEffect has a chance to set up the axios interceptor.
   */
  const ready = useMemo(() => (
    PROVIDER === 'local' || clerkAuth.isLoaded && (user || !clerkAuth.isSignedIn)),
    [clerkAuth.isLoaded, user, clerkAuth.isSignedIn]
  );

  return (
    <AuthenticationContext.Provider
      value={{ ...data, provider: PROVIDER }}
    >
      { ready && props.children }
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationContextProvider;
