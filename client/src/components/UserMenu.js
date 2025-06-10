// @flow

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Dropdown, Header, Icon } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import SessionService from '../services/Session';
import styles from './UserMenu.module.css';
import UserAvatar from './UserAvatar';

const UserMenu = () => {
  const { t } = useTranslation();
  const { user } = SessionService.getSession();

  const trigger = (
    <>
      <UserAvatar
        name={user.email}
        size={40}
      />
      <Header
        className={cx(styles.ui, styles.header)}
        content={user.name}
        size='small'
      />
    </>
  );

  return (
    <Dropdown
      className={cx(styles.userMenu, styles.ui, styles.dropdown)}
      direction='left'
      trigger={trigger}
    >
      <Dropdown.Menu
        className={styles.menu}
      >
        { PermissionsService.canResetPassword() && (
          <Dropdown.Item
            as={Link}
            className={styles.item}
            to='/password_reset'
          >
            <Icon>
              <RiLockPasswordLine />
            </Icon>
            { t('UserMenu.labels.resetPassword') }
          </Dropdown.Item>
        )}
        <Dropdown.Item
          as={Link}
          className={styles.item}
          to='/logout'
        >
          <Icon
            name='log out'
          />
          { t('UserMenu.labels.logout') }
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
