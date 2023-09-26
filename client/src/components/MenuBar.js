// @flow

import React from 'react';
import { Grid } from 'semantic-ui-react';
import Logo from './Logo';
import UserMenu from './UserMenu';

const MenuBar = () => {
  return (
    <Grid
      columns={3}
    >
      <Grid.Column>
        <Logo />
      </Grid.Column>
      <Grid.Column>
      </Grid.Column>
      <Grid.Column
        textAlign='right'
      >
        <UserMenu />
      </Grid.Column>
    </Grid>
  );
};

export default MenuBar;