// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import type { ProjectModelRelationship as ProjectModelRelationshipType } from '../types/ProjectModel';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelTransform from '../transforms/ProjectModel';
import useParams from '../hooks/ParsedParams';

type Props = EditContainerProps & {
  item: ProjectModelRelationshipType
};

const ProjectModelRelationshipModal = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <Modal
      as={Form}
      centered={false}
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('ProjectModelRelationshipModal.title.edit')
          : t('ProjectModelRelationshipModal.title.add')}
      />
      <Modal.Content>
        <Form.Input
          error={props.isError('related_model_id')}
          label={t('ProjectModelRelationshipModal.labels.related')}
          required={props.isRequired('related_model_id')}
        >
          <AssociatedDropdown
            collectionName='project_models'
            onSearch={(search) => ProjectModelsService.fetchAll({ search, project_id: projectId })}
            onSelection={props.onAssociationInputChange.bind(this, 'related_model_id', 'related_model')}
            renderOption={ProjectModelTransform.toDropdown.bind(this)}
            searchQuery={props.item.related_model?.name}
            value={props.item.related_model_id}
          />
        </Form.Input>
        <Form.Input
          error={props.isError('name')}
          label={t('ProjectModelRelationshipModal.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
        <Form.Checkbox
          checked={props.item.multiple}
          error={props.isError('multiple')}
          label={t('ProjectModelRelationshipModal.labels.multiple')}
          onChange={props.onCheckboxInputChange.bind(this, 'multiple')}
        />
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default ProjectModelRelationshipModal;
