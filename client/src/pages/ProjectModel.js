// @flow

import {
  BooleanIcon,
  EmbeddedList,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsEmbeddedList } from '@performant-software/user-defined-fields';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import ModelClassDropdown from '../components/ModelClassDropdown';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import ProjectModelRelationshipModal from '../components/ProjectModelRelationshipModal';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelsUtils from '../utils/ProjectModels';
import ProjectSettingsContext from '../context/ProjectSettings';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

const INVERSE_RELATIONSHIP_KEY = 'inverse_project_model_relationships';
const RELATIONSHIP_KEY = 'project_model_relationships';

type Props = EditContainerProps & {
  item: ProjectModelType
};

const ProjectModelForm = (props: Props) => {
  const { setProjectModel } = useContext(ProjectSettingsContext);
  const params = useParams();
  const { t } = useTranslation();

  /**
   * Returns the model name for the passed relationship based on context.
   *
   * @type {function(*): string}
   */
  const resolveModelName = useCallback((relationship) => (
    relationship.inverse ? relationship.primary_model?.name : relationship.related_model?.name
  ), []);

  /**
   * Returns the name for the passed relationship based on context.
   *
   * @type {function(*): string|*}
   */
  const resolveName = useCallback((relationship) => (
    relationship.inverse ? relationship.inverse_name : relationship.name
  ), []);

  /**
   * Returns the multiple attribute for the passed relationship based on context.
   *
   * @type {function(*): boolean|*}
   */
  const resolveMultiple = useCallback((relationship) => (
    relationship.inverse ? relationship.inverse_multiple : relationship.multiple
  ), []);

  /**
   * Saves the passed relationship to the appropriate collection.
   *
   * @type {(function(*): void)|*}
   */
  const onSaveRelationship = useCallback((relationship) => {
    const association = relationship.inverse ? INVERSE_RELATIONSHIP_KEY : RELATIONSHIP_KEY;
    props.onSaveChildAssociation(association, relationship);
  }, []);

  /**
   * Deletes the passed relationship from the appropriate collection.
   *
   * @type {(function(*): void)|*}
   */
  const onDeleteRelationship = useCallback((relationship) => {
    const association = relationship.inverse ? INVERSE_RELATIONSHIP_KEY : RELATIONSHIP_KEY;
    props.onDeleteChildAssociation(association, relationship);
  }, []);

  /*
   * For a new record, set the foreign key ID based on the route parameters.
   */
  useEffect(() => {
    if (!props.item.id && params.projectId) {
      props.onSetState({ project_id: params.projectId });
    }

    setProjectModel(props.item);
  }, []);

  /**
   * Sets the current project model on the ProjectSettings context.
   */
  useEffect(() => setProjectModel(props.item), [props.item]);

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
          addButton={{
            basic: false,
            color: 'blue',
            location: 'top'
          }}
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
            resolve: resolveModelName
          }, {
            name: 'name',
            label: t('ProjectModel.relationships.columns.name'),
            resolve: resolveName
          }, {
            name: 'multiple',
            label: t('ProjectModel.relationships.columns.multiple'),
            render: (relationship) => <BooleanIcon value={resolveMultiple(relationship)} />
          }]}
          items={props.item.all_project_model_relationships}
          modal={{
            component: ProjectModelRelationshipModal
          }}
          onDelete={onDeleteRelationship}
          onSave={onSaveRelationship}
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
