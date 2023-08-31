// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import type { PlaceName as PlaceNameType } from '../types/Place';

type Props = EditContainerProps & {
  item: PlaceNameType
};

const PlaceNameModal: AbstractComponent<any> = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('PlaceNameModal.title.edit')
          : t('PlaceNameModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          autoFocus
          error={props.isError('name')}
          label={t('PlaceNameModal.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
        <Form.Checkbox
          checked={props.item.primary}
          label={t('PlaceNameModal.labels.primary')}
          onChange={props.onCheckboxInputChange.bind(this, 'primary')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default PlaceNameModal;
