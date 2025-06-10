// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'semantic-ui-react';
import type { User as UserType } from '../types/User';

type Props = {
  user: UserType
};

const UserStatus = (props: Props) => {
  const { t } = useTranslation();

  if (props.user?.last_sign_in_at) {
    return (
      <Label
        color='green'
        content={t('UserStatus.labels.active')}
        icon='checkmark'
      />
    );
  }

  return (
    <Label
      content={t('UserStatus.labels.pending')}
      icon='clock outline'
    />
  );
};

export default UserStatus;
