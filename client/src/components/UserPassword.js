// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Icon, Message } from 'semantic-ui-react';
import UserUtils from '../utils/User';
import styles from './UserPassword.module.css';

type RequirementProps = {
  isValid: boolean,
  text: string
};

/**
 * Renders an individual password requirement with an interactive icon.
 */
const PasswordRequirement = ({ isValid, text }: RequirementProps) => (
  <Message.Item>
    <Icon
      color={isValid ? 'green' : 'grey'}
      name={isValid ? 'check circle' : 'circle outline'}
    />
    {text}
  </Message.Item>
);

type Props = EditContainerProps & {
  autoFocus?: boolean,
  email: string
};

const UserPassword = (props: Props) => {
  const { t } = useTranslation();
  const password = props.item.password || '';

  const passwordValidation = useMemo(
    () => UserUtils.validatePasswordGranular(password),
    [password]
  );

  return (
    <>
      <Message>
        <Message.Header
          content={t('UserPassword.messages.password.header')}
        />
        <Message.List className={styles.passwordlist}>
          <PasswordRequirement 
            isValid={passwordValidation.len} 
            text={t('UserPassword.messages.password.length')} 
          />
          <PasswordRequirement 
            isValid={passwordValidation.number} 
            text={t('UserPassword.messages.password.number')} 
          />
          <PasswordRequirement 
            isValid={passwordValidation.lower} 
            text={t('UserPassword.messages.password.lower')} 
          />
          <PasswordRequirement 
            isValid={passwordValidation.upper} 
            text={t('UserPassword.messages.password.upper')} 
          />
          <PasswordRequirement 
            isValid={passwordValidation.symbol} 
            text={t('UserPassword.messages.password.symbol')} 
          />
        </Message.List>
      </Message>
      <Form.Input
        autoComplete='new-password'
        autoFocus={props.autoFocus}
        error={props.isError('password')}
        label={t('UserPassword.labels.password')}
        minLength={8}
        pattern='(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).*'
        passwordrules='minlength: 8; required: lower; required: upper; required: digit; required: special;'
        onChange={props.onTextInputChange.bind(this, 'password')}
        required={props.isRequired('password')}
        type='password'
        value={props.item.password || ''}
      />
      <Form.Input
        autoComplete='new-password'
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
