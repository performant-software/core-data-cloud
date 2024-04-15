// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Place as PlaceType } from '../types/Place';
import PlaceForm from './PlaceForm';

type Props = EditContainerProps & {
  item: PlaceType
};

const PlaceModal = (props: Props) => {
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
        content={t('PlaceModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <PlaceForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default PlaceModal;
