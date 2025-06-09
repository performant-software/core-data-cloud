// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'semantic-ui-react';

type Props = {
  lastSignIn: number
};

const UserStatus = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Label
      color={props.lastSignIn
        ? 'green'
        : 'undefined'}
      content={props.lastSignIn
        ? t('UserStatus.labels.active')
        : t('UserStatus.labels.pending')}
    />
  );
};

export default UserStatus;
