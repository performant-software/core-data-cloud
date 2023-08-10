// @flow

import { BaseService } from '@performant-software/shared-components';
import _ from 'underscore';

BaseService.configure((axios) => {
// Sets the authentication token as a request header
  axios.interceptors.request.use((config) => {
    // Set the user authentication token
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      _.extend(config.headers, { Authorization: user.token });
    }

    return config;
  }, (error) => Promise.reject(error));
});
