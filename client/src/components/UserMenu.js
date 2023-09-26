// @flow

import React from 'react';
import Avatar from 'boring-avatars';
import { Dropdown, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import SessionService from '../services/Session';
import UserAvatar from './UserAvatar';



const UserMenu = () => {
  const { user } = SessionService.getSession();

  const trigger = (
    <>
      <UserAvatar
        name={user.email}
        size={40}
      />
      <Header
        content={user.name}
        size='small'
        style={{
          margin: '0rem 0rem 0rem 1rem'
        }}
      />
    </>
  );

  return (
    <Dropdown
      direction='left'
      trigger={trigger}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <Dropdown.Menu>
        <Dropdown.Item
          as={Link}
          to='/logout'
        >
          <Icon
            name='log out'
          />
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default UserMenu;
