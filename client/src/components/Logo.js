// @flow

import React from 'react';
import { TbDatabaseShare } from 'react-icons/tb';
import { Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link
    style={{
      color: 'unset',
      display: 'flex',
      alignItems: 'center',
      height: '100%'
    }}
    to='/projects'
  >
    <TbDatabaseShare
      size='2em'
    />
    <Header
      content={'Core Data Cloud'}
      style={{
        marginLeft: '0.5rem',
        marginTop: '0px'
      }}
    />
  </Link>
);

export default Logo;
