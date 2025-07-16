// @flow

import {
  BooleanIcon,
  EmbeddedList,
  Selectize,
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsEmbeddedList } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { FaUnlockAlt } from 'react-icons/fa';
import { FaShareFromSquare } from 'react-icons/fa6';
import { useLocation } from 'react-router';
import uuid from 'react-uuid';
import {
  Form,
  Header,
  Icon,
  Message
} from 'semantic-ui-react';
import _ from 'underscore';
import ItemHeader from '../components/ItemHeader';
import ItemLayout from '../components/ItemLayout';
import ModelClassDropdown from '../components/ModelClassDropdown';
import ProjectContext from '../context/Project';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import ProjectModelRelationshipModal from '../components/ProjectModelRelationshipModal';
import ProjectModelAccessesService from '../services/ProjectModelAccesses';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelsUtils from '../utils/ProjectModels';
import ProjectsService from '../services/Projects';
import styles from './ProjectModel.module.css';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

const INVERSE_RELATIONSHIP_KEY = 'inverse_project_model_relationships';
const RELATIONSHIP_KEY = 'project_model_relationships';

type Props = EditContainerProps & {
  item: ProjectModelType
};

const ProjectModelForm = (props: Props) => {
  const [accessModal, setAccessModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);

  const { state } = useLocation();
  const { projectId } = useParams();
  const { t } = useTranslation();

  const { setReloadProjectModels } = useContext(ProjectContext);

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
    props.onSaveChildAssociation('all_project_model_relationships', relationship);
  }, []);

  /**
   * Deletes the passed relationship from the appropriate collection.
   *
   * @type {(function(*): void)|*}
   */
  const onDeleteRelationship = useCallback((relationship) => {
    const association = relationship.inverse ? INVERSE_RELATIONSHIP_KEY : RELATIONSHIP_KEY;
    props.onDeleteChildAssociation(association, relationship);
    props.onDeleteChildAssociation('all_project_model_relationships', relationship);
  }, []);

  /**
   * If we've saved the record, reload project models.
   */
  useEffect(() => {
    if (state?.saved) {
      setReloadProjectModels(true);
    }
  }, [state?.saved]);

  /*
   * For a new record, set the foreign key ID based on the route parameters.
   */
  useEffect(() => {
    if (!props.item.id && projectId) {
      props.onSetState({ project_id: projectId });
    }
  }, []);

  return (
    <ItemLayout>
      <ItemLayout.Header>
        <ItemHeader
          back={{
            label: t('ProjectModel.labels.all'),
            url: `/projects/${projectId}/project_models`
          }}
          name={props.item.name}
        />
      </ItemLayout.Header>
      <ItemLayout.Content>
        <SimpleEditPage
          {...props}
          className={styles.projectModel}
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
              value={props.item.name || ''}
            />
            <Form.Input
              error={props.isError('order')}
              label={t('ProjectModel.labels.order')}
              required={props.isRequired('order')}
              onChange={props.onTextInputChange.bind(this, 'order')}
              type='number'
              value={props.item.order || 0}
            />
            <Form.Checkbox
              checked={props.item.allow_identifiers}
              error={props.isError('allow_identifiers')}
              label={t('ProjectModel.labels.allowIdentifiers')}
              onChange={props.onCheckboxInputChange.bind(this, 'allow_identifiers')}
              required={props.isRequired('allow_identifiers')}
            />
          </SimpleEditPage.Tab>
          <SimpleEditPage.Tab
            key='fields'
            name={t('ProjectModel.tabs.fields')}
          >
            <UserDefinedFieldsEmbeddedList
              actions={[{
                name: 'edit',
                icon: 'pencil'
              }, {
                name: 'delete',
                icon: 'times'
              }]}
              addButton={{
                basic: false,
                color: 'blue',
                location: 'top'
              }}
              defaults={{
                table_name: props.item.model_class
              }}
              excludeColumns={['table_name', 'uuid']}
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
                name: 'edit',
                icon: 'pencil'
              }, {
                name: 'delete',
                icon: 'times'
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
              }, {
                name: 'order',
                label: t('ProjectModel.relationships.columns.order')
              }, {
                name: 'uuid',
                label: t('Common.columns.uuid'),
                hidden: true
              }]}
              items={props.item.all_project_model_relationships}
              modal={{
                component: ProjectModelRelationshipModal
              }}
              onDelete={onDeleteRelationship}
              onSave={onSaveRelationship}
            />
          </SimpleEditPage.Tab>
          <SimpleEditPage.Tab
            key='access'
            name={t('ProjectModel.tabs.access')}
          >
            <Message
              className={cx(styles.ui, styles.icon, styles.message)}
              color='blue'
              icon
            >
              <Icon
                className={styles.icon}
              >
                <FaUnlockAlt
                  size='1rem'
                />
              </Icon>
              { t('ProjectModel.accesses.message', { name: props.item.name }) }
            </Message>
            <EmbeddedList
              actions={[{
                name: 'delete',
                icon: 'times'
              }]}
              addButton={{
                basic: false,
                color: 'blue',
                location: 'top',
                onClick: () => setAccessModal(true)
              }}
              columns={[{
                name: 'project_name',
                label: t('ProjectModel.accesses.columns.name'),
                resolve: (projectModelAccess) => projectModelAccess.project?.name
              }]}
              items={props.item.project_model_accesses}
              onDelete={props.onDeleteChildAssociation.bind(this, 'project_model_accesses')}
              onSave={props.onSaveChildAssociation.bind(this, 'project_model_accesses')}
            />
            { accessModal && (
              <Selectize
                collectionName='projects'
                onClose={() => setAccessModal(false)}
                onLoad={(params) => ProjectsService.fetchAll({
                  ...params,
                  discoverable: true,
                  project_id: props.item.project_id,
                  sort_by: 'name'
                })}
                onSave={(projects) => {
                  const find = (project) => _.findWhere(props.item.project_model_accesses, { project_id: project.id });
                  const create = (project) => ({ uid: uuid(), project_id: project.id, project });

                  props.onMultiAddChildAssociations(
                    'project_model_accesses',
                    _.map(projects, (project) => find(project) || create(project))
                  );

                  setAccessModal(false);
                }}
                renderItem={(project) => project.name}
                selectedItems={_.pluck(props.item.project_model_accesses, 'project')}
                title={t('ProjectModel.accesses.title')}
                width='60%'
              />
            )}
          </SimpleEditPage.Tab>
          <SimpleEditPage.Tab
            key='discover'
            name={t('ProjectModel.tabs.discover')}
          >
            <Message
              className={cx(styles.ui, styles.icon, styles.message)}
              color='blue'
              icon
            >
              <Icon
                className={styles.icon}
              >
                <FaShareFromSquare
                  size='1rem'
                />
              </Icon>
              { t('ProjectModel.shares.message', { name: props.item.name }) }
            </Message>
            <EmbeddedList
              actions={[{
                name: 'delete',
                icon: 'times'
              }]}
              addButton={{
                basic: false,
                color: 'blue',
                location: 'top',
                onClick: () => setShareModal(true)
              }}
              columns={[{
                name: 'project_name',
                label: t('ProjectModel.shares.columns.projectName'),
                resolve: (projectModelShare) => projectModelShare.project_model_access?.project_model?.project?.name
              }, {
                name: 'model_name',
                label: t('ProjectModel.shares.columns.modelName'),
                resolve: (projectModelShare) => projectModelShare.project_model_access?.project_model?.name
              }]}
              items={props.item.project_model_shares}
              onDelete={props.onDeleteChildAssociation.bind(this, 'project_model_shares')}
              onSave={props.onSaveChildAssociation.bind(this, 'project_model_shares')}
            />
            { shareModal && (
              <Selectize
                collectionName='project_model_accesses'
                onClose={() => setShareModal(false)}
                onLoad={(params) => ProjectModelAccessesService.fetchAll({
                  ...params,
                  project_id: props.item.project_id,
                  model_class: props.item.model_class,
                  sort_by: [
                    'core_data_connector_projects.name',
                    'core_data_connector_project_models.name'
                  ]
                })}
                onSave={(projectModelAccesses) => {
                  const find = (projectModelAccess) => _.findWhere(props.item.project_model_shares, {
                    project_model_access_id: projectModelAccess.id
                  });

                  const create = (projectModelAccess) => ({
                    uid: uuid(),
                    project_model_access_id: projectModelAccess.id,
                    project_model_access: projectModelAccess
                  });

                  props.onMultiAddChildAssociations(
                    'project_model_shares',
                    _.map(
                      projectModelAccesses,
                      (projectModelAccess) => find(projectModelAccess) || create(projectModelAccess)
                    )
                  );

                  setShareModal(false);
                }}
                renderItem={(projectModelAccess) => (
                  <Header
                    content={projectModelAccess.project_model.project.name}
                    subheader={projectModelAccess.project_model.name}
                  />
                )}
                selectedItems={_.pluck(props.item.project_model_shares, 'project_model_access')}
                title={t('ProjectModel.shares.title')}
                width='60%'
              />
            )}
          </SimpleEditPage.Tab>
        </SimpleEditPage>
      </ItemLayout.Content>
    </ItemLayout>
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
