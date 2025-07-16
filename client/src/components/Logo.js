// @flow

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TbDatabaseShare } from 'react-icons/tb';
import { Link } from 'react-router';
import { Header } from 'semantic-ui-react';
import styles from './Logo.module.css';

const Logo = () => {
  const { t } = useTranslation();

  return (
    <Link
      className={styles.logo}
      to='/projects'
    >
      <TbDatabaseShare
        size='2em'
      />
      <Header
        className={cx(styles.ui, styles.header)}
        content={t('Logo.title')}
      />
    </Link>
  );
};

export default Logo;
