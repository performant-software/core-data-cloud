// @flow

import React from 'react';
import { Navigate } from 'react-router';

type Props = {
  to?: string
};

const UnauthorizedRedirect = ({ to = '/projects' }: Props) => (
  <Navigate
    replace
    state={{ unauthorized: true }}
    to={to}
  />
);

export default UnauthorizedRedirect;
