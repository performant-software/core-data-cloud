// @flow

import { BaseService, BaseTransform } from '@performant-software/shared-components';
import _ from 'underscore';
import AuthenticationTransform from '../transforms/Authentication';
import SessionService from './Session';

class Authentication extends BaseService {
  /**
   * Returns the authentication base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/auth/login';
  }

  /**
   * Returns the authentication transform object.
   *
   * @returns {Authentication}
   */
  getTransform(): typeof BaseTransform {
    return AuthenticationTransform;
  }

  /**
   * Returns true if the current user is authenticated.
   *
   * @returns {*|boolean}
   */
  isAuthenticated(): boolean {
    const { token, exp } = SessionService.getSession();
    if (!(token || exp)) {
      return false;
    }

    const expirationDate = new Date(Date.parse(exp));
    const today = new Date();

    return !_.isEmpty(token) && expirationDate.getTime() > today.getTime();
  }

  /**
   * Attempts to authenticate the current user and stores the response in local storage.
   *
   * @param params
   *
   * @returns {*}
   */
  login(params: any): Promise<any> {
    return this
      .create(params)
      .then(({ data }) => SessionService.createSession(data));
  }

  /**
   * Removes the properties of the current user from local storage.
   *
   * @returns {Promise<*>}
   */
  logout(): Promise<any> {
    // Remove the user from the session
    SessionService.destroySession();

    // Return a promise
    return Promise.resolve();
  }
}

const AuthenticationService: Authentication = new Authentication();
export default AuthenticationService;
