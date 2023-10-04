// @flow

import cx from 'classnames';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import AdminMenu from './AdminMenu';
import Logo from './Logo';
import ProjectModelsMenu from './ProjectModelsMenu';
import styles from './MenuBar.module.css';
import UserMenu from './UserMenu';

const MenuBar = () => (
  <Grid
    className={cx(styles.menuBar, styles.ui, styles.grid)}
  >
    <Grid.Column
      width={3}
    >
      <Logo />
    </Grid.Column>
    <Grid.Column
      className={cx(styles.column, styles.centered)}
      width={10}
    >
      <AdminMenu />
      <ProjectModelsMenu />
    </Grid.Column>
    <Grid.Column
      textAlign='right'
      width={3}
    >
      <UserMenu />
    </Grid.Column>
  </Grid>
);

export default MenuBar;
