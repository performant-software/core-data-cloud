// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Message } from 'semantic-ui-react';
import { type User as UserType } from '../types/User';
import UsersService from '../services/Users';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserType
};

const UserForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <SimpleEditPage
      {...props}
      menuProps={{
        text: true
      }}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <Form.Input
          error={props.isError('name')}
          label={t('User.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
        <Form.Input
          error={props.isError('email')}
          label={t('User.labels.email')}
          required={props.isRequired('email')}
          onChange={props.onTextInputChange.bind(this, 'email')}
          value={props.item.email}
        />
        <Form.Checkbox
          checked={props.item.admin}
          error={props.isError('admin')}
          label={t('User.labels.admin')}
          onChange={props.onCheckboxInputChange.bind(this, 'admin')}
        />
        <Message
          content={t('User.messages.password.content')}
          header={t('User.messages.password.header')}
        />
        <Form.Input
          error={props.isError('password')}
          label={t('User.labels.password')}
          onChange={props.onTextInputChange.bind(this, 'password')}
          required={props.isRequired('password')}
          type='password'
          value={props.item.password || ''}
        />
        <Form.Input
          error={props.isError('password_confirmation')}
          label={t('User.labels.passwordConfirmation')}
          onChange={props.onTextInputChange.bind(this, 'password_confirmation')}
          required={props.isRequired('password_confirmation')}
          type='password'
          value={props.item.password_confirmation || ''}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const User: AbstractComponent<any> = withReactRouterEditPage(UserForm, {
  id: 'userId',
  onInitialize: (id) => (
    UsersService
      .fetchOne(id)
      .then(({ data }) => data.user)
  ),
  onSave: (user) => (
    UsersService
      .save(user)
      .then(({ data }) => data.user)
  ),
  required: ['name', 'email']
});

export default User;
