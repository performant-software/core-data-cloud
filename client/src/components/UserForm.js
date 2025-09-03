// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import type { User } from '../types/User';
import UserRoles from '../utils/UserRoles';

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
        value={props.item.name || ''}
      />
      <Form.Input
        disabled={props.disabled}
        error={props.isError('email')}
        label={t('UserForm.labels.email')}
        required={props.isRequired('email')}
        onChange={props.onTextInputChange.bind(this, 'email')}
        value={props.item.email || ''}
      />
      { PermissionsService.isAdmin() && (
        <>
          <Form.Dropdown
            error={props.isError('role')}
            label={t('UserForm.labels.role')}
            onChange={props.onTextInputChange.bind(this, 'role')}
            options={UserRoles.getRoleOptions()}
            required={props.isRequired('role')}
            selection
            selectOnBlur={false}
            value={props.item.role}
          />
          <Form.Checkbox
            checked={props.item.require_password_change}
            error={props.isError('require_password_change')}
            label={t('UserForm.labels.requirePasswordChange')}
            onChange={props.onCheckboxInputChange.bind(this, 'require_password_change')}
            required={props.isRequired('require_password_change')}
          />
        </>
      )}
    </>
  );
};

export default UserForm;
