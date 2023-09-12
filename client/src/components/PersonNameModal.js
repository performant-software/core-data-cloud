// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import type { PersonName as PersonNameType } from '../types/Person';

type Props = EditContainerProps & {
  item: PersonNameType
};

const PersonNameModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('PersonNameModal.title.edit')
          : t('PersonNameModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          autoFocus
          error={props.isError('first_name')}
          label={t('PersonNameModal.labels.firstName')}
          required={props.isRequired('first_name')}
          onChange={props.onTextInputChange.bind(this, 'first_name')}
          value={props.item.first_name}
        />
        <Form.Input
          error={props.isError('middle_name')}
          label={t('PersonNameModal.labels.middleName')}
          required={props.isRequired('middle_name')}
          onChange={props.onTextInputChange.bind(this, 'middle_name')}
          value={props.item.middle_name}
        />
        <Form.Input
          error={props.isError('last_name')}
          label={t('PersonNameModal.labels.lastName')}
          required={props.isRequired('last_name')}
          onChange={props.onTextInputChange.bind(this, 'last_name')}
          value={props.item.last_name}
        />
        <Form.Checkbox
          checked={props.item.primary}
          label={t('PersonNameModal.labels.primary')}
          onChange={props.onCheckboxInputChange.bind(this, 'primary')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default PersonNameModal;
