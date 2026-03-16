// @flow
import React from 'react';
import ClerkAuthenticationContextProvider from './ClerkAuthenticationContextProvider';
import LocalAuthenticationContextProvider from './LocalAuthenticationContextProvider';

const PROVIDER = import.meta.env.VITE_AUTH_PROVIDER || 'local';

const AuthenticationContextProvider = (props: any) => {
  if (PROVIDER === 'clerk') {
    return (
      <ClerkAuthenticationContextProvider>
        { props.children }
      </ClerkAuthenticationContextProvider>
    );
  }

  return (
    <LocalAuthenticationContextProvider>
      { props.children }
    </LocalAuthenticationContextProvider>
  );
}

export default AuthenticationContextProvider;
