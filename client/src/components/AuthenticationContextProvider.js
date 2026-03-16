// @flow
import React, { useContext } from 'react';
import { AuthenticationContext, LocalAuthenticationContext } from '../context/Authentication';
import ClerkAuthenticationContextProvider from './ClerkAuthenticationContextProvider';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const DefaultAuthenticationContextProvider = (props: any) => {
  const localData = useContext(LocalAuthenticationContext);

  return (
    <AuthenticationContext.Provider
      value={{ ...localData, provider: PROVIDER }}
    >
      { props.children }
    </AuthenticationContext.Provider>
  )
}

const AuthenticationContextProvider = (props: any) => {
  if (PROVIDER === 'clerk') {
    return (
      <ClerkAuthenticationContextProvider>
        { props.children }
      </ClerkAuthenticationContextProvider>
    );
  }

  return (
    <DefaultAuthenticationContextProvider>
      { props.children }
    </DefaultAuthenticationContextProvider>
  );
}

export default AuthenticationContextProvider;
