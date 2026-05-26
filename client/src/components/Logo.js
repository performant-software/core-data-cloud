// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import styles from './Logo.module.css';

const Logo = () => {
  const { t } = useTranslation();

  return (
    <Link
      className={styles.logo}
      to='/projects'
    >
      <img
        alt={t('Logo.title')}
        className={styles.image}
        src='/logo.svg'
      />
    </Link>
  );
};

export default Logo;
