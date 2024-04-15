// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';

type Props = EditContainerProps;

const UserPassword = (props: Props) => {
  const { t } = useTranslation();

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
};

export default UserPassword;
