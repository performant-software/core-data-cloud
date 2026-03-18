import React from 'react';
import { Button } from 'semantic-ui-react';
import { SignInButton } from '@clerk/react';
import { useTranslation } from 'react-i18next';
import styles from './ClerkLoginModal.module.css';

const ClerkLoginModal = () => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.clerkModal}
    >
      <h1 className={styles.clerkModalHeader}>
        {t('ClerkLoginModal.header')}
      </h1>
      <SignInButton>
        <Button
          color='blue'
        >
          {t('ClerkLoginModal.login')}
        </Button>
      </SignInButton>
    </div>
  );
}

export default ClerkLoginModal;
