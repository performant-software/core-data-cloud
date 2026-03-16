// @flow

import { createContext } from 'react';
import type { User } from '../types/User';

type AuthenticationContextType = {
  authenticated: boolean,
  login: (params: any) => Promise<any>,
  logout: () => Promise<any>,
  provider: string,
  user: User
};

export const LocalAuthenticationContext = createContext<AuthenticationContextType>({
  authenticated: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  provider: 'local',
  user: undefined
});

export const AuthenticationContext = createContext<AuthenticationContextType>({
  authenticated: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  provider: import.meta.env.VITE_AUTH_PROVIDER || 'local',
  user: undefined
});
