// @flow

import type { User as UserType } from '../types/User';
import UsersService from './Users';

type SessionType = {
  exp: string,
  token: string,
  user: UserType
};

const SESSION_KEY = 'core_data_cloud_user';

class Session {
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
    localStorage.clear();
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
   * Re-fetches the user and creates a new session.
   *
   * @returns {Promise<R>|Promise<R|unknown>|Promise<void>|*}
   */
  reset(): Promise<any> {
    const { token, exp, user: { id } } = this.getSession();

    return UsersService
      .fetchOne(id)
      .then(({ data: { user } }) => this.createSession({ token, exp, user }));
  }
}

const SessionService: Session = new Session();
export default SessionService;
