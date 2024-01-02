// @flow

import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';
import styles from './ItemHeader.module.css';

type Props = {
  back?: {
    label: string,
    url: string
  },
  name: string
};

const ItemHeader = (props: Props) => (
  <div
    className={styles.itemHeader}
  >
    { props.back?.url && props.back?.label && (
      <Link
        to={props.back.url}
      >
        <Icon
          name='arrow left'
        />
        { props.back.label }
      </Link>
    )}
    { props.name && (
      <Header
        className={cx(styles.ui, styles.header)}
        content={props.name}
        size='large'
      />
    )}
  </div>
);

export default ItemHeader;
