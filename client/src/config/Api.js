// @flow

import { BaseService } from '@performant-software/shared-components';
import _ from 'underscore';
import SessionService from '../services/Session';

BaseService.configure((axios) => {
// Sets the authentication token as a request header
  axios.interceptors.request.use((config) => {
    // Set the user authentication token
    const { token } = SessionService.getSession();
    if (token) {
      _.extend(config.headers, { Authorization: token });
    }

    return config;
  }, (error) => Promise.reject(error));
});
