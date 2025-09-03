// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { Link } from 'react-router';
import { Header, Icon } from 'semantic-ui-react';
import ItemContext from '../context/Item';
import styles from './ItemHeader.module.css';

type Props = {
  back?: {
    label: string,
    url: string
  },
  name: string
};

const ItemHeader = (props: Props) => {
  const { uuid } = useContext(ItemContext);

  return (
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
      <div
        className={styles.container}
      >
        { props.name && (
          <Header
            className={cx(styles.ui, styles.header, styles.name)}
            content={props.name}
            size='large'
          />
        )}
        { uuid && (
          <Header
            className={cx(styles.ui, styles.header)}
            subheader={uuid}
          />
        )}
      </div>
    </div>
  );
};

export default ItemHeader;
