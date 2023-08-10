// @flow

import React, { type ComponentType, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import styles from './Admin.module.css';
import UsersService from '../services/Users';

const Admin: ComponentType<any> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Logs the user out and navigates to the index page.
   *
   * @type {function(): Promise<R>|Promise<R|unknown>|Promise<*>|*}
   */
  const onLogout = useCallback(() => AuthenticationService.logout().then(() => navigate('/')), []);

  return (
    <div
      className={styles.admin}
    >
      <header
        className={styles.header}
      >
        { t('Admin.messages.success') }
        <p />
        <Button
          content={t('Admin.buttons.logout')}
          onClick={onLogout}
          size='large'
        />
        <p />
        <Button
          content={t('Admin.buttons.test')}
          onClick={() => UsersService.fetchAll()}
        />
      </header>
    </div>
  );
};

export default Admin;
