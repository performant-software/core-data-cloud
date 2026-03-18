import React from 'react';
import { Button } from 'semantic-ui-react';
import { useClerk } from '@clerk/react';
import { useTranslation } from 'react-i18next';
import styles from './ClerkLoginModal.module.css';

const ClerkLoginModal = () => {
  const { t } = useTranslation();

  const { buildSignInUrl } = useClerk();

  return (
    <div
      className={styles.clerkModal}
    >
      <h1 className={styles.clerkModalHeader}>
        {t('ClerkLoginModal.header')}
      </h1>
      <Button
        as='a'
        color='blue'
        href={buildSignInUrl()}
      >
        {t('ClerkLoginModal.login')}
      </Button>
    </div>
  );
}

export default ClerkLoginModal;
