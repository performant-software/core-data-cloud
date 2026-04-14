// @flow

import { useAuth } from '@clerk/react';
import React, { useEffect, useMemo, useState } from 'react';
import { AuthenticationContext } from '../context/Authentication';
import UsersService from '../services/Users';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const ClerkAuthenticationContextProvider = (props: any) => {
  const clerkAuth = useAuth();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (clerkAuth.isSignedIn && !user) {
      UsersService.getMe()
        .then(res => setUser(res.data))
        .catch(() => clerkAuth.signOut());
    }
  }, [clerkAuth.isSignedIn]);

  const authenticated = useMemo(() => {
    if (!clerkAuth.isLoaded) return !!user;
    return clerkAuth.isSignedIn;
  }, [clerkAuth.isLoaded, clerkAuth.isSignedIn, user]);

  const data = useMemo(() => ({
    authenticated,
    logout: clerkAuth.signOut,
    user
  }), [authenticated, clerkAuth.signOut, user]);

  useEffect(() => {
    if (clerkAuth.isLoaded && !!(user || !clerkAuth.isSignedIn)) {
      setReady(true);
    }
  }, [clerkAuth.isSignedIn, user]);

  return (
    <AuthenticationContext.Provider
      value={{ ...data, provider: PROVIDER }}
    >
      {ready && props.children}
    </AuthenticationContext.Provider>
  );
};

export default ClerkAuthenticationContextProvider;
