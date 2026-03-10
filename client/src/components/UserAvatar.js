// @flow

import React from 'react';
import styles from './UserAvatar.module.css';
import Avatar from 'boring-avatars';

type Props = {
  name: string,
  size: number,
  href?: string
};

const COLORS = [
  '#EDD8BB',
  '#E2AA87',
  '#FEF7E1',
  '#A2D3C7',
  '#EF8E7D'
];

const UserAvatar = (props: Props) => {
  if (props.href) {
    return (
      <img
        alt='User avatar'
        className={styles.avatar}
        style={{ width: props.size, height: props.size }}
        src={props.href}
      />
    )
  }

  return (
    <Avatar
      colors={COLORS}
      name={props.name}
      size={props.size}
      variant='beam'
    />
  )
}

export default UserAvatar;
