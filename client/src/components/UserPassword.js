// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';
import UserUtils from '../utils/User';

type Props = EditContainerProps & {
  email: string
};

const UserPassword = (props: Props) => {
  const { t } = useTranslation();

  const showPasswordFields = useMemo(() => UserUtils.showPasswordFields(props.email), [props.email]);

  if (showPasswordFields) {
    return (
      <>
        <Message
          content={t('UserPassword.messages.password.content')}
          header={t('UserPassword.messages.password.header')}
        />
        <Form.Input
          error={props.isError('password')}
          label={t('UserPassword.labels.password')}
          onChange={props.onTextInputChange.bind(this, 'password')}
          required={props.isRequired('password')}
          type='password'
          value={props.item.password || ''}
        />
        <Form.Input
          error={props.isError('password_confirmation')}
          label={t('UserPassword.labels.passwordConfirmation')}
          onChange={props.onTextInputChange.bind(this, 'password_confirmation')}
          required={props.isRequired('password_confirmation')}
          type='password'
          value={props.item.password_confirmation || ''}
        />
      </>
    );
  }

  return <p>{t('UserPassword.messages.sso.cantChange')}</p>;
};

export default UserPassword;
