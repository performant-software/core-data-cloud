// @flow

import React, {
  type AbstractComponent
} from 'react';
import { Navigate, useSearchParams } from 'react-router';
import SessionService from '../services/Session';

const SsoLogin: AbstractComponent<any> = () => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('token')) {
    try {
      const decoded = atob(searchParams.get('token'));
      const parsed = JSON.parse(decoded);
      SessionService.createSession(parsed);
      return <Navigate to='/projects' />;
    } catch {
      return <Navigate to='/' />;
    }
  }

  return <Navigate to='/' />;
};

export default SsoLogin;
