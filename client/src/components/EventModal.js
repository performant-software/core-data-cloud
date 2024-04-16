// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import EventForm from './EventForm';
import type { Event as EventType } from '../types/Event';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';

type Props = EditContainerProps & {
  item: EventType
};

const EventModal = (props: Props) => {
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
        content={t('EventModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <EventForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default EventModal;
