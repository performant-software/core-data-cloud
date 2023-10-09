// @flow

import { useEffect } from 'react';
import AuthenticationService from '../services/Authentication';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AuthenticationService.logout().then(() => navigate('/'));
  }, []);

  return null;
};

export default Logout;
