// @flow

import { BaseService, BaseTransform } from '@performant-software/shared-components';
import _ from 'underscore';
import AuthenticationTransform from '../transforms/Authentication';
import Permissions from './Permissions';
import type { User as UserType } from '../types/User';
import UsersService from './Users';

type SessionType = {
  exp: string,
  token: string,
  user: UserType
};

const SESSION_KEY = 'core_data_cloud_user';

class Authentication extends BaseService {
  /**
   * Creates a new session by storing the data in local storage.
   *
   * @param data
   */
  createSession(data: SessionType) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }

  /**
   * Destroys the current session by removing the data from local storage.
   */
  destroySession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Returns the authentication base URL.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    return '/auth/login';
  }

  /**
   * Parses the data from local storage and returns the value.
   *
   * @returns {*}
   */
  getSession(): SessionType {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
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
    const { token, exp } = this.getSession();
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
      .then(({ data }) => {
        // Store the user on the session
        this.createSession(data);

        // Reset permissions
        const { user } = this.getSession();
        Permissions.reset(user);
      });
  }

  /**
   * Removes the properties of the current user from local storage.
   *
   * @returns {Promise<*>}
   */
  logout(): Promise<any> {
    // Remove the user from the session
    this.destroySession();

    // Reset permissions
    Permissions.reset();

    // Return a promise
    return Promise.resolve();
  }

  /**
   * Re-fetches the user and creates a new session.
   */
  reset() {
    const { token, exp, user: { id } } = this.getSession();

    UsersService
      .fetchOne(id)
      .then(({ data: { user } }) => {
        // Create a new session
        this.createSession({ token, exp, user });

        // Reset permissions
        Permissions.reset(user);
      });
  }
}

const Auth: Authentication = new Authentication();
export default Auth;
