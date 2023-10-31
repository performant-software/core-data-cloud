// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { Header } from 'semantic-ui-react';
import CurrentRecordContext from '../context/CurrentRecord';
import styles from './CurrentRecordHeader.module.css';

const CurrentRecordHeader = () => {
  const { name } = useContext(CurrentRecordContext);

  if (!name) {
    return null;
  }

  return (
    <Header
      className={cx(styles.currentRecordHeader, styles.ui, styles.header)}
      content={name}
      size='large'
    />
  );
};

export default CurrentRecordHeader;
