// @flow

import cx from 'classnames';
import React, { useCallback, type ComponentType } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { TbDatabaseShare } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { Menu, Ref } from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import styles from './Sidebar.module.css';

type Props = {
  color?: string,
  context: {
    current: ?HTMLDivElement
  },
  inverted?: boolean
};

const Sidebar: ComponentType<any> = withTranslation()((props: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Logs the user out and navigates to the index page.
   *
   * @type {function(): Promise<R>|Promise<R|unknown>|Promise<*>|*}
   */
  const onLogout = useCallback(() => AuthenticationService.logout().then(() => navigate('/')), []);

  return (
    <Ref
      innerRef={props.context}
    >
      <Menu
        borderless
        className={cx(styles.sidebar, styles.ui, styles.vertical, styles.menu)}
        color={props.color}
        fixed='left'
        inverted={props.inverted}
        vertical
      >
        <Menu.Item
          className={cx(styles.item)}
          header
        >
          <TbDatabaseShare
            size='2em'
          />
          Core Data Cloud
        </Menu.Item>
        <MenuLink
          className={styles.item}
          content={t('Sidebar.labels.projects')}
          parent
          to='/projects'
        />
        { PermissionsService.canEditUsers() && (
          <MenuLink
            className={styles.item}
            content={t('Sidebar.labels.users')}
            parent
            to='/users'
          />
        )}
        <Menu.Item
          className={styles.item}
          content={t('Sidebar.labels.logout')}
          onClick={onLogout}
        />
      </Menu>
    </Ref>
  );
});

export default Sidebar;
