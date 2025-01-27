// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import type { User } from '../types/User';
import UserPassword from './UserPassword';

type Props = EditContainerProps & {
  item: User
};

const UserForm: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Input
        autoFocus
        disabled={props.disabled}
        error={props.isError('name')}
        label={t('UserForm.labels.name')}
        required={props.isRequired('name')}
        onChange={props.onTextInputChange.bind(this, 'name')}
        value={props.item.name}
      />
      <Form.Input
        disabled={props.disabled}
        error={props.isError('email')}
        label={t('UserForm.labels.email')}
        required={props.isRequired('email')}
        onChange={props.onTextInputChange.bind(this, 'email')}
        value={props.item.email}
      />
      { PermissionsService.isAdmin() && (
        <Form.Checkbox
          disabled={props.disabled}
          checked={props.item.admin}
          error={props.isError('admin')}
          label={t('UserForm.labels.admin')}
          onChange={props.onCheckboxInputChange.bind(this, 'admin')}
        />
      )}
      <UserPassword
        {...props}
        email={props.item.email}
      />
    </>
  );
};

export default UserForm;
