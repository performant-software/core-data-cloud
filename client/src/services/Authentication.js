// @flow

import { BaseService, BaseTransform } from '@performant-software/shared-components';
import AuthenticationTransform from '../transforms/Authentication';

class Authentication extends BaseService {
  /**
   * Returns the authentication base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/api/auth/login';
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
    if (!localStorage.getItem('user')) {
      return false;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { token, exp } = user;

    const expirationDate = new Date(Date.parse(exp));
    const today = new Date();

    return token && token.length && expirationDate.getTime() > today.getTime();
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
      .then((response) => localStorage.setItem('user', JSON.stringify(response.data)));
  }

  /**
   * Removes the properties of the current user from local storage.
   *
   * @returns {Promise<*>}
   */
  logout(): Promise<any> {
    localStorage.removeItem('user');
    return Promise.resolve();
  }
}

const Auth: Authentication = new Authentication();
export default Auth;
