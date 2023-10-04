// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsEmbeddedList } from '@performant-software/user-defined-fields';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import ModelClassDropdown from '../components/ModelClassDropdown';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import ProjectModelRelationshipModal from '../components/ProjectModelRelationshipModal';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelsUtils from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: ProjectModelType
};

const ProjectModelForm = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();

  /*
   * For a new record, set the foreign key ID based on the route parameters.
   */
  useEffect(() => {
    if (!props.item.id && params.projectId) {
      props.onSetState({ project_id: params.projectId });
    }
  }, []);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='details'
        name={t('ProjectModel.tabs.details')}
      >
        <Form.Input
          error={props.isError('model_class')}
          label={t('ProjectModel.labels.type')}
          required={props.isRequired('model_class')}
        >
          <ModelClassDropdown
            fluid
            onChange={props.onTextInputChange.bind(this, 'model_class')}
            value={props.item.model_class}
          />
        </Form.Input>
        <Form.Input
          error={props.isError('name')}
          label={t('ProjectModel.labels.name')}
          required={props.isRequired('name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          value={props.item.name}
        />
      </SimpleEditPage.Tab>
      <SimpleEditPage.Tab
        key='fields'
        name={t('ProjectModel.tabs.fields')}
      >
        <UserDefinedFieldsEmbeddedList
          defaults={{
            table_name: props.item.model_class
          }}
          excludeColumns={['table_name']}
          items={props.item.user_defined_fields}
          onDelete={props.onDeleteChildAssociation.bind(this, 'user_defined_fields')}
          onSave={props.onSaveChildAssociation.bind(this, 'user_defined_fields')}
        />
      </SimpleEditPage.Tab>
      <SimpleEditPage.Tab
        key='relationships'
        name={t('ProjectModel.tabs.relationships')}
      >
        <EmbeddedList
          actions={[{
            name: 'edit'
          }, {
            name: 'delete'
          }]}
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
          columns={[{
            name: 'model_name',
            label: t('ProjectModel.relationships.columns.related'),
            resolve: (relationship) => relationship.related_model.name
          }, {
            name: 'name',
            label: t('ProjectModel.relationships.columns.name')
          }, {
            name: 'multiple',
            label: t('ProjectModel.relationships.columns.multiple'),
            render: (relationship) => <BooleanIcon value={relationship.multiple} />
          }]}
          items={props.item.project_model_relationships}
          modal={{
            component: ProjectModelRelationshipModal
          }}
          onDelete={props.onDeleteChildAssociation.bind(this, 'project_model_relationships')}
          onSave={props.onSaveChildAssociation.bind(this, 'project_model_relationships')}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const ProjectModel = withReactRouterEditPage(ProjectModelForm, {
  id: 'projectModelId',
  onInitialize: (id) => (
    ProjectModelsService
      .fetchOne(id)
      .then(({ data }) => data.project_model)
  ),
  onSave: (projectModel) => (
    ProjectModelsService
      .save(projectModel)
      .then(({ data }) => data.project_model)
  ),
  required: ['model_class', 'name'],
  resolveValidationError: ProjectModelsUtils.resolveValidationError.bind(this)
});

export default ProjectModel;
