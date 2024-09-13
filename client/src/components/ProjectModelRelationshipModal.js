// @flow

import { AssociatedDropdown, TabbedModal } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsEmbeddedList } from '@performant-software/user-defined-fields';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import type { ProjectModelRelationship as ProjectModelRelationshipType } from '../types/ProjectModel';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelTransform from '../transforms/ProjectModel';
import useParams from '../hooks/ParsedParams';

type Props = EditContainerProps & {
  item: ProjectModelRelationshipType
};

const RelationshipForm = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Calls the "/project_models" API endpoint with the passed search query.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onSearch = useCallback((search) => (
    ProjectModelsService.fetchAll({ search, project_id: projectId })
  ), [projectId]);

  return (
    <>
      <Form.Input
        error={props.isError('related_model_id')}
        label={t('ProjectModelRelationshipModal.labels.related')}
        required={props.isRequired('related_model_id')}
      >
        <AssociatedDropdown
          collectionName='project_models'
          onSearch={onSearch}
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
      <Form.Input
        error={props.isError('order')}
        label={t('ProjectModelRelationshipModal.labels.order')}
        required={props.isRequired('order')}
        onChange={props.onTextInputChange.bind(this, 'order')}
        type='number'
        value={props.item.order}
      />
      <Form.Checkbox
        checked={props.item.multiple}
        error={props.isError('multiple')}
        label={t('ProjectModelRelationshipModal.labels.multiple')}
        onChange={props.onCheckboxInputChange.bind(this, 'multiple')}
      />
      <Form.Checkbox
        checked={props.item.allow_inverse}
        error={props.isError('allow_inverse')}
        label={t('ProjectModelRelationshipModal.labels.allowInverse')}
        onChange={props.onCheckboxInputChange.bind(this, 'allow_inverse')}
      />
      { props.item.allow_inverse && (
        <>
          <Form.Input
            error={props.isError('inverse_name')}
            label={t('ProjectModelRelationshipModal.labels.inverseName')}
            required={props.isRequired('inverse_name')}
            onChange={props.onTextInputChange.bind(this, 'inverse_name')}
            value={props.item.inverse_name}
          />
          <Form.Checkbox
            checked={props.item.inverse_multiple}
            error={props.isError('inverse_multiple')}
            label={t('ProjectModelRelationshipModal.labels.inverseMultiple')}
            onChange={props.onCheckboxInputChange.bind(this, 'inverse_multiple')}
          />
        </>
      )}
    </>
  );
};

const InverseForm = (props: Props) => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <>
      <Form.Input
        error={props.isError('primary_model_id')}
        label={t('ProjectModelRelationshipModal.labels.related')}
        required={props.isRequired('primary_model_id')}
      >
        <AssociatedDropdown
          collectionName='project_models'
          onSearch={(search) => ProjectModelsService.fetchAll({ search, project_id: projectId })}
          onSelection={props.onAssociationInputChange.bind(this, 'primary_model_id', 'primary_model')}
          renderOption={ProjectModelTransform.toDropdown.bind(this)}
          searchQuery={props.item.primary_model?.name}
          value={props.item.primary_model_id}
        />
      </Form.Input>
      <Form.Input
        error={props.isError('inverse_name')}
        label={t('ProjectModelRelationshipModal.labels.name')}
        required={props.isRequired('inverse_name')}
        onChange={props.onTextInputChange.bind(this, 'inverse_name')}
        value={props.item.inverse_name}
      />
      <Form.Input
        error={props.isError('order')}
        label={t('ProjectModelRelationshipModal.labels.order')}
        required={props.isRequired('order')}
        onChange={props.onTextInputChange.bind(this, 'order')}
        type='number'
        value={props.item.order}
      />
      <Form.Checkbox
        checked={props.item.inverse_multiple}
        error={props.isError('inverse_multiple')}
        label={t('ProjectModelRelationshipModal.labels.multiple')}
        onChange={props.onCheckboxInputChange.bind(this, 'inverse_multiple')}
      />
      { props.item.allow_inverse && (
        <>
          <Form.Input
            error={props.isError('name')}
            label={t('ProjectModelRelationshipModal.labels.inverseName')}
            required={props.isRequired('name')}
            onChange={props.onTextInputChange.bind(this, 'name')}
            value={props.item.name}
          />
          <Form.Checkbox
            checked={props.item.multiple}
            error={props.isError('multiple')}
            label={t('ProjectModelRelationshipModal.labels.inverseMultiple')}
            onChange={props.onCheckboxInputChange.bind(this, 'multiple')}
          />
        </>
      )}
    </>
  );
};

const ProjectModelRelationshipModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <TabbedModal
      as={Form}
      centered={false}
      renderHeader={() => (props.item.id
        ? t('ProjectModelRelationshipModal.title.edit')
        : t('ProjectModelRelationshipModal.title.add'))}
      open
    >
      <TabbedModal.Tab
        name={t('Common.tabs.details')}
      >
        { props.item.inverse && (
          <InverseForm
            {...props}
          />
        )}
        { !props.item.inverse && (
          <RelationshipForm
            {...props}
          />
        )}
      </TabbedModal.Tab>
      <TabbedModal.Tab
        name={t('Common.tabs.fields')}
      >
        <UserDefinedFieldsEmbeddedList
          actions={[{
            name: 'edit',
            icon: 'pencil'
          }, {
            name: 'delete',
            icon: 'times'
          }]}
          defaults={{
            table_name: 'CoreDataConnector::Relationship'
          }}
          excludeColumns={['table_name', 'uuid']}
          items={props.item.user_defined_fields}
          onDelete={props.onDeleteChildAssociation.bind(this, 'user_defined_fields')}
          onSave={props.onSaveChildAssociation.bind(this, 'user_defined_fields')}
        />
      </TabbedModal.Tab>
      { props.children }
    </TabbedModal>
  );
};

export default ProjectModelRelationshipModal;
