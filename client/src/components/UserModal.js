// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import type { User } from '../types/User';
import UserForm from './UserForm';
import UserPassword from './UserPassword';
import UserUtils from '../utils/User';
import usePermissions from '../hooks/Permissions';

type Props = EditContainerProps & {
  item: User
};

const UserModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();
  const isNew = !props.item.id;
  const { isSSO } = usePermissions();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('UserModal.title.edit')
          : t('UserModal.title.add')}
      />
      <Modal.Content>
        <UserForm
          {...props}
          isNew={isNew}
        />
        { !isNew && !isSSO() && (
          <UserPassword
            {...props}
          />
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default UserModal;
