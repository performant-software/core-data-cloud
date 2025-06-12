// @flow

import React, { type ComponentType, type Node } from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticationService from '../services/Authentication';
import UnauthorizedToaster from './UnauthorizedToaster';

type Props = {
  children: Array<Node>
};

const AuthenticatedRoute: ComponentType<any> = ({ children }: Props) => {
  if (!AuthenticationService.isAuthenticated()) {
    return <Navigate to='/' />;
  }

  return (
    <>
      { children }
      <UnauthorizedToaster />
    </>
  );
};

export default AuthenticatedRoute;
