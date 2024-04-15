// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Instance as InstanceType } from '../types/Instance';
import InstanceForm from './InstanceForm';

type Props = EditContainerProps & {
  item: InstanceType
};

const InstanceModal = (props: Props) => {
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
        content={t('InstanceModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <InstanceForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default InstanceModal;
