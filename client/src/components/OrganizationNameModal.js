// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import type { OrganizationName as OrganizationNameType } from '../types/Organization';

type Props = EditContainerProps & {
  item: OrganizationNameType
};

const OrganizationNameModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('OrganizationNameModal.title.edit')
          : t('OrganizationNameModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          autoFocus
          error={props.isError('name')}
          label={t('OrganizationNameModal.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name || ''}
        />
        <Form.Checkbox
          checked={props.item.primary}
          label={t('OrganizationNameModal.labels.primary')}
          onChange={props.onCheckboxInputChange.bind(this, 'primary')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default OrganizationNameModal;
