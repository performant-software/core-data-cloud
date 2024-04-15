// @flow

import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Session from '../services/Session';
import styles from './UserLabel.module.css';

const UserLabel = () => {
  const { user } = Session.getSession();

  return (
    <div
      className={styles.userLabel}
    >
      <FaUserCircle />
      <div
        className={styles.name}
      >
        { user.name }
      </div>
    </div>
  );
};

export default UserLabel;
