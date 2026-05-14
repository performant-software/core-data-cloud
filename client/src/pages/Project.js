// @flow

import { AssociatedDropdown, SimpleEditPage, Toaster } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import {
  Button,
  Confirm,
  Form,
  Header,
  Icon,
  Message,
  MessageHeader,
  Segment,
  SegmentGroup
} from 'semantic-ui-react';
import usePermissions from '../hooks/Permissions';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelTransform from '../transforms/ProjectModel';
import { type Project as ProjectType } from '../types/Project';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import ProjectsService from '../services/Projects';
import { SlLock } from 'react-icons/sl';
import styles from './Project.module.css';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';
import ConfirmDeleteChallenge from '../components/ConfirmDeleteChallenge';

type Props = EditContainerProps & {
  item: ProjectType
};

const Project = (props: Props) => {
  const [clearModal, setClearModal] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();
  const {
    canArchiveProject,
    canDeleteProject,
    canEditProjectSettings
  } = usePermissions();

  const editPageProps = useReactRouterEditPage({
    id: 'projectId',
    onInitialize: (id) => (
      ProjectsService
        .fetchOne(id)
        .then(({ data }) => data.project)
    ),
    onSave: (project) => (
      ProjectsService
        .save(project)
        .then(({ data }) => data.project)
    ),
    required: ['name']
  });

  const { item } = editPageProps;

  /**
   * Clears all of the data from the current project.
   *
   * @type {function(): Promise<void>}
   */
  const onClear = useCallback(() => {
    setClearing(true);

    return ProjectsService
      .clear(item)
      .then(() => setCleared(true))
      .then(() => setClearModal(false))
      .finally(() => setClearing(false));
  }, [item]);

  /**
   * Deletes the current project and navigates back to the list.
   *
   * @type {function(): Promise<R>}
   */
  const onDelete = useCallback(() => {
    setDeleting(true);

    return ProjectsService
      .delete(item)
      .then(() => setDeleteModal(false))
      .then(() => navigate('/projects'))
      .finally(() => setDeleting(false));
  }, [navigate, item]);

  /**
   * Calls the /core_data/project_models API endpoint.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onSearch = useCallback((search) => (
    ProjectModelsService.fetchAll({
      search,
      project_id: item.id,
      model_class: 'CoreDataConnector::Item'
    })
  ), [item.id]);

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ProjectSettingsMenu />
      <SimpleEditPage
        className={styles.project}
        {...props}
        {...editPageProps}
      >
        <SimpleEditPage.Tab
          key='default'
        >
          <Form.Input
            autoFocus
            error={editPageProps.isError('name')}
            label={t('Project.labels.name')}
            required={editPageProps.isRequired('name')}
            onChange={editPageProps.onTextInputChange.bind(this, 'name')}
            value={item.name || ''}
          />
          <Form.TextArea
            error={editPageProps.isError('description')}
            label={t('Project.labels.description')}
            required={editPageProps.isRequired('description')}
            rows={5}
            onChange={editPageProps.onTextInputChange.bind(this, 'description')}
            value={item.description || ''}
          />
          <Form.Input
            error={editPageProps.isError('faircopy_cloud_url')}
            label={t('Project.labels.fairCopyCloudUrl')}
            required={editPageProps.isRequired('faircopy_cloud_url')}
            onChange={editPageProps.onTextInputChange.bind(this, 'faircopy_cloud_url')}
            value={item.faircopy_cloud_url || ''}
          />
          <Form.Input
            error={editPageProps.isError('faircopy_cloud_project_model_id')}
            label={t('Project.labels.faircopyCloudConnectedModel')}
            required={editPageProps.isRequired('faircopy_cloud_project_model_id')}
          >
            <AssociatedDropdown
              collectionName='project_models'
              onSearch={onSearch}
              onSelection={editPageProps.onAssociationInputChange.bind(
                this,
                'faircopy_cloud_project_model_id',
                'faircopy_cloud_project_model'
              )}
              renderOption={ProjectModelTransform.toDropdown.bind(this)}
              searchQuery={item.faircopy_cloud_project_model_id?.name}
              value={item.faircopy_cloud_project_model_id}
            />
          </Form.Input>
          <Form.Input
            error={editPageProps.isError('map_library_url')}
            label={t('Project.labels.mapLibraryUrl')}
            required={editPageProps.isRequired('map_library_url')}
            onChange={editPageProps.onTextInputChange.bind(this, 'map_library_url')}
            value={item.map_library_url || ''}
          />
          <Header
            content={t('Project.labels.reconcile')}
          />
          <Form.Input
            error={editPageProps.isError('reconciliation_credentials.host')}
            label={t('Project.labels.host')}
            required={editPageProps.isRequired('reconciliation_credentials.host')}
            onChange={editPageProps.onJsonInputChange.bind(this, 'reconciliation_credentials', 'host')}
            value={item.reconciliation_credentials?.host || ''}
          />
          <Form.Input
            error={editPageProps.isError('reconciliation_credentials.port')}
            label={t('Project.labels.port')}
            required={editPageProps.isRequired('reconciliation_credentials.port')}
            onChange={editPageProps.onJsonInputChange.bind(this, 'reconciliation_credentials', 'port')}
            value={item.reconciliation_credentials?.port || ''}
          />
          <Form.Input
            error={editPageProps.isError('reconciliation_credentials.protocol')}
            label={t('Project.labels.protocol')}
            required={editPageProps.isRequired('reconciliation_credentials.protocol')}
            onChange={editPageProps.onJsonInputChange.bind(this, 'reconciliation_credentials', 'protocol')}
            value={item.reconciliation_credentials?.protocol || ''}
          />
          <Form.Input
            error={editPageProps.isError('reconciliation_credentials.api_key')}
            label={t('Project.labels.apiKey')}
            required={editPageProps.isRequired('reconciliation_credentials.api_key')}
            onChange={editPageProps.onJsonInputChange.bind(this, 'reconciliation_credentials', 'api_key')}
            value={item.reconciliation_credentials?.api_key || ''}
          />
          <Form.Input
            error={editPageProps.isError('reconciliation_credentials.collection_name')}
            label={t('Project.labels.collectionName')}
            required={editPageProps.isRequired('reconciliation_credentials.collection_name')}
            onChange={editPageProps.onJsonInputChange.bind(this, 'reconciliation_credentials', 'collection_name')}
            value={item.reconciliation_credentials?.collection_name || ''}
          />
          <div
            className={styles.section}
          >
            <Message
              className={cx(styles.ui, styles.message)}
              color='blue'
              icon
            >
              <Icon>
                <IoSearchOutline />
              </Icon>
              <Message.Content
                className={styles.content}
              >
                <Message.Header
                  className={styles.header}
                  content={t('Project.messages.share.header')}
                />
                <Form.Checkbox
                  checked={item.discoverable}
                  className={styles.field}
                  label={t('Project.messages.share.content')}
                  error={editPageProps.isError('discoverable')}
                  onChange={editPageProps.onCheckboxInputChange.bind(this, 'discoverable')}
                />
              </Message.Content>
            </Message>
          </div>
          { canArchiveProject() && (
            <div
              className={styles.section}
            >
              <Message
                className={cx(styles.ui, styles.message)}
                color='yellow'
                icon
              >
                <Icon>
                  <SlLock />
                </Icon>
                <Message.Content
                  className={styles.content}
                >
                  <Message.Header
                    className={styles.header}
                    content={t('Project.messages.archive.header')}
                  />
                  <Form.Checkbox
                    checked={item.archived}
                    className={styles.field}
                    label={t('Project.messages.archive.content')}
                    error={editPageProps.isError('archived')}
                    onChange={editPageProps.onCheckboxInputChange.bind(this, 'archived')}
                  />
                </Message.Content>
              </Message>
            </div>
          )}
          { canDeleteProject(item.id) && (
            <div
              className={styles.section}
            >
              <Header
                content={t('Project.labels.danger')}
              />
              <SegmentGroup>
                <Segment
                  className={cx(styles.ui, styles.segment)}
                  color='red'
                  padded
                >
                  <Header
                    className={cx(styles.ui, styles.small, styles.header)}
                    content={t('Project.actions.clear.header')}
                    subheader={t('Project.actions.clear.content')}
                    size='small'
                  />
                  <Button
                    className={cx(styles.ui, styles.button)}
                    color='red'
                    content={t('Project.buttons.clear')}
                    icon='times'
                    onClick={() => setClearModal(true)}
                  />
                  {clearModal && (
                    <ConfirmDeleteChallenge
                      name={item.name}
                      onClose={() => setClearModal(false)}
                      onConfirm={onClear}
                    />
                  )}
                  { cleared && (
                    <Toaster
                      onDismiss={() => setCleared(false)}
                      type='positive'
                    >
                      <MessageHeader
                        content={t('Project.messages.cleared.header')}
                      />
                      <p>{ t('Project.messages.cleared.content') }</p>
                    </Toaster>
                  )}
                </Segment>
                <Segment
                  className={cx(styles.ui, styles.segment)}
                  color='red'
                  padded
                >
                  <Header
                    className={cx(styles.ui, styles.small, styles.header)}
                    content={t('Project.actions.delete.header')}
                    subheader={t('Project.actions.delete.content')}
                    size='small'
                  />
                  <Button
                    className={cx(styles.ui, styles.button)}
                    color='red'
                    content={t('Project.buttons.delete')}
                    icon='trash'
                    onClick={() => setDeleteModal(true)}
                  />
                  {deleteModal && (
                    <ConfirmDeleteChallenge
                      name={item.name}
                      onClose={() => setDeleteModal(false)}
                      onConfirm={onDelete}
                    />
                  )}
                </Segment>
              </SegmentGroup>
            </div>
          )}
        </SimpleEditPage.Tab>
      </SimpleEditPage>
    </>
  );
};
export default Project;
