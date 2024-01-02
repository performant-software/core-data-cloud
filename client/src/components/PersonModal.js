// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Person as PersonType } from '../types/Person';
import PersonForm from './PersonForm';

type Props = EditContainerProps & {
  item: PersonType
};

const PersonModal = (props: Props) => {
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
        content={t('PersonModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <PersonForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default PersonModal;
