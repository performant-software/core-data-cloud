// @flow

import React from 'react';
import Avatar from 'boring-avatars';

type Props = {
  name: string,
  size: number
};

const COLORS = [
  '#EDD8BB',
  '#E2AA87',
  '#FEF7E1',
  '#A2D3C7',
  '#EF8E7D'
];

const UserAvatar = (props: Props) => (
  <Avatar
    size={props.size}
    name={props.name}
    variant='marble'
    colors={COLORS}
  />
);

export default UserAvatar;
