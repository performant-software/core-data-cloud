// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Organization as OrganizationType } from '../types/Organization';
import OrganizationForm from './OrganizationForm';

type Props = EditContainerProps & {
  item: OrganizationType
};

const OrganizationModal = (props: Props) => {
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
        content={t('OrganizationModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <OrganizationForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default OrganizationModal;
