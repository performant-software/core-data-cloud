// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';

type Props = EditContainerProps & {
  item: any
};

const NameModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('NameModal.title.edit')
          : t('NameModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          autoFocus
          error={props.isError('name')}
          label={t('NameModal.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default NameModal;
