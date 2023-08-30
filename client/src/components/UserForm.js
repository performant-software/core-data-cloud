// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';
import Permissions from '../services/Permissions';
import type { User } from '../types/User';

type Props = EditContainerProps & {
  item: User
};

const UserForm: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Input
        autoFocus
        error={props.isError('name')}
        label={t('UserForm.labels.name')}
        required={props.isRequired('name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        value={props.item.name}
      />
      <Form.Input
        error={props.isError('email')}
        label={t('UserForm.labels.email')}
        required={props.isRequired('email')}
        onChange={props.onTextInputChange.bind(this, 'email')}
        value={props.item.email}
      />
      { Permissions.isAdmin() && (
        <Form.Checkbox
          checked={props.item.admin}
          error={props.isError('admin')}
          label={t('UserForm.labels.admin')}
          onChange={props.onCheckboxInputChange.bind(this, 'admin')}
        />
      )}
      <Message
        content={t('UserForm.messages.password.content')}
        header={t('UserForm.messages.password.header')}
      />
      <Form.Input
        error={props.isError('password')}
        label={t('UserForm.labels.password')}
        onChange={props.onTextInputChange.bind(this, 'password')}
        required={props.isRequired('password')}
        type='password'
        value={props.item.password || ''}
      />
      <Form.Input
        error={props.isError('password_confirmation')}
        label={t('UserForm.labels.passwordConfirmation')}
        onChange={props.onTextInputChange.bind(this, 'password_confirmation')}
        required={props.isRequired('password_confirmation')}
        type='password'
        value={props.item.password_confirmation || ''}
      />
    </>
  );
};

export default UserForm;
