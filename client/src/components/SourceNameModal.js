// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';

type Props = EditContainerProps & {
  item: any
};

const SourceNameModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('NameRelationModal.title.edit')
          : t('NameRelationModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          autoFocus
          label={t('NameRelationModal.labels.name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
        <Form.Checkbox
          checked={props.item.primary}
          label={t('NameRelationModal.labels.primary')}
          onChange={props.onCheckboxInputChange.bind(this, 'primary')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default SourceNameModal;
