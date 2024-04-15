// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Item as ItemType } from '../types/Item';
import ItemForm from './ItemForm';

type Props = EditContainerProps & {
  item: ItemType
};

const ItemModal = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Sets the required foreign keys on the state.
   */
  initializeRelated(props);

  return (
    <Modal
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={t('ItemModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <ItemForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default ItemModal;
