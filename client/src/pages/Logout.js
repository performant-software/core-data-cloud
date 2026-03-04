// @flow

import { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../context/Authentication';
import { useNavigate } from 'react-router';

const Logout = () => {
  const { logout } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => navigate('/'));
  }, [logout, navigate]);

  return null;
};

export default Logout;
