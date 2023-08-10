// @flow

import React, { type ComponentType } from 'react';
import { Trans } from 'react-i18next';
import Login from '../components/Login';
import styles from './Home.module.css';

const Home: ComponentType<any> = () => (
  <div
    className={styles.home}
  >
    <header
      className={styles.header}
    >
      <Trans
        i18nKey='Home.header'
      >
        Welcome to Rails-React Template
        <p>
          Edit
          <code>src/App.js</code>
          and save to reload.
        </p>
      </Trans>
      <Login />
    </header>
  </div>
);

export default Home;
