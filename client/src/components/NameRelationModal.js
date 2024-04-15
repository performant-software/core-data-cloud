// @flow

import type { EditContainerProps } from '@performant-software/shared-components/types';
import { AssociatedDropdown } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import NameModal from './NameModal';
import NamesService from '../services/Names';
import NamesTransform from '../transforms/Names';
import { Name as NameType } from '../types/Name';
import useParams from '../hooks/ParsedParams';

type Props = EditContainerProps & {
  item: any
};

const NameRelationModal: AbstractComponent<any> = (props: Props) => {
  const [newName, setNewName] = useState<NameType | null>(null);
  const { t } = useTranslation();

  const { projectId } = useParams();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('NameRelationModal.title.edit')
          : t('NameRelationModal.title.add')}
      />
      <Modal.Content>
        {newName
          ? (
            <Form.Input
              disabled
              label={t('NameRelationModal.labels.name')}
              onChange={props.onTextInputChange.bind(this, 'name')}
              value={newName.name}
            />
          )
          : (
            <AssociatedDropdown
              collectionName='names'
              label={t('NameRelationModal.labels.name')}
              modal={{
                component: NameModal,
                onSave: (name: NameType) => (
                  new Promise((resolve) => {
                    setNewName(name);
                    resolve(name);
                  })
                )
              }}
              onChange={props.onTextInputChange.bind(this, 'name')}
              onSearch={(search) => NamesService.fetchAll({
                project_id: projectId,
                search,
                sort_by: 'name'
              })}
              onSelection={props.onAssociationInputChange.bind(this, 'name_id', 'name')}
              renderOption={NamesTransform.toDropdown.bind(this)}
              searchQuery={props.item.name && props.item.name.name}
            />
          )}
        <Form.Checkbox
          checked={props.item.primary}
          label={t('NameRelationModal.labels.primary')}
          onChange={props.onCheckboxInputChange.bind(this, 'primary')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default NameRelationModal;
