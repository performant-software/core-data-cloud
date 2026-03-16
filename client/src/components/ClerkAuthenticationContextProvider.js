// @flow
import { useAuth } from '@clerk/react';
import React, { useEffect, useMemo, useState } from 'react';
import { AuthenticationContext } from '../context/Authentication';
import UsersService from '../services/Users';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const ClerkAuthenticationContextProvider = (props: any) => {
  const clerkAuth = useAuth();
  const [user, setUser] = useState(null);

  /**
   * Call the /me endpoint to get the current user's data.
   */
  useEffect(() => {
    if (clerkAuth.isSignedIn && !user) {
      UsersService.getMe()
        .then(res => setUser(res.data))
        .catch(() => clerkAuth.signOut());
    }
  }, [clerkAuth.isSignedIn]);

  const data = useMemo(() => {
    return {
      authenticated: clerkAuth.isSignedIn,
      logout: clerkAuth.signOut,
      user
    };
  }, [clerkAuth, user]);

  /**
   * Block the initial render so the useEffect has a chance to set up the axios interceptor.
   */
  const ready = useMemo(() => (
    clerkAuth.isLoaded && (user || !clerkAuth.isSignedIn)),
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

export default ClerkAuthenticationContextProvider;
