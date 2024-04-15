// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Taxonomy as TaxonomyItemType } from '../types/Taxonomy';
import TaxonomyItemForm from './TaxonomyItemForm';

type Props = EditContainerProps & {
  item: TaxonomyItemType
};

const TaxonomyItemModal = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Sets the required foreign keys on the state.
   */
  initializeRelated(props);

  return (
    <Modal
      as={Form}
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={t('TaxonomyItemModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <TaxonomyItemForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default TaxonomyItemModal;
