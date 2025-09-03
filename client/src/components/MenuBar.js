// @flow

import cx from 'classnames';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminMenu from './AdminMenu';
import Logo from './Logo';
import styles from './MenuBar.module.css';
import UserMenu from './UserMenu';

const MenuBar = () => (
  <Grid
    className={cx(styles.menuBar, styles.ui, styles.grid)}
  >
    <Grid.Column
      className={styles.column}
      width={4}
    >
      <Logo />
    </Grid.Column>
    <Grid.Column
      className={cx(styles.column, styles.centered)}
      width={9}
    >
      <AdminMenu />
    </Grid.Column>
    <Grid.Column
      className={styles.column}
      textAlign='right'
      width={3}
    >
      <UserMenu />
    </Grid.Column>
  </Grid>
);

export default MenuBar;
