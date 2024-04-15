// @flow

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Dropdown, Header, Icon } from 'semantic-ui-react';
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
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
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
