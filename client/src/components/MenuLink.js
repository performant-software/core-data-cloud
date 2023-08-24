// @flow

import React, { type ComponentType, type Node } from 'react';
import {
  Link,
  useMatch,
  useResolvedPath
} from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import _ from 'underscore';

type Props = {
  children?: Node | (active: boolean) => Node,
  parent?: boolean,
  to: string
};

const MenuLink: ComponentType<any> = (props: Props) => {
  const url = `${props.to}${props.parent ? '/*' : ''}`;
  const { pathname } = useResolvedPath(url);
  const active = useMatch({ path: pathname, end: true });

  return (
    <Menu.Item
      {..._.omit(props, 'children')}
      active={active}
      as={Link}
    >
      { props.children }
    </Menu.Item>
  );
};

export default MenuLink;
