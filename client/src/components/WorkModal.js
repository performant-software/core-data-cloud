// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'semantic-ui-react';
import { initializeRelated } from '../hooks/Relationship';
import type { Work as WorkType } from '../types/Work';
import WorkForm from './WorkForm';

type Props = EditContainerProps & {
  item: WorkType
};

const WorkModal = (props: Props) => {
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
        content={t('WorkModal.title')}
      />
      <Modal.Content
        scrolling
      >
        <WorkForm
          {...props}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default WorkModal;
