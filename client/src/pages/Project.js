// @flow

import { AssociatedDropdown, SimpleEditPage, Toaster } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
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
import PermissionsService from '../services/Permissions';
import ProjectModelsService from '../services/ProjectModels';
import ProjectModelTransform from '../transforms/ProjectModel';
import { type Project as ProjectType } from '../types/Project';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import ProjectsService from '../services/Projects';
import { SlLock } from 'react-icons/sl';
import styles from './Project.module.css';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: ProjectType
};

const ProjectForm = (props: Props) => {
  const [clearModal, setClearModal] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Clears all of the data from the current project.
   *
   * @type {function(): Promise<void>}
   */
  const onClear = useCallback(() => (
    ProjectsService
      .clear(props.item)
      .then(() => setCleared(true))
      .then(() => setClearModal(false))
  ), [props.item]);

  /**
   * Deletes the current project and navigates back to the list.
   *
   * @type {function(): Promise<R>}
   */
  const onDelete = useCallback(() => (
    ProjectsService
      .delete(props.item)
      .then(() => navigate('/projects'))
      .finally(() => setDeleteModal(false))
  ), [navigate, props.item]);

  /**
   * Calls the /core_data/project_models API endpoint.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onSearch = useCallback((search) => (
    ProjectModelsService.fetchAll({
      search,
      project_id: props.item.id,
      model_class: 'CoreDataConnector::Item'
    })
  ), [props.item.id]);

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!PermissionsService.canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ProjectSettingsMenu />
      <SimpleEditPage
        className={styles.project}
        {...props}
      >
        <SimpleEditPage.Tab
          key='default'
        >
          <Form.Input
            autoFocus
            error={props.isError('name')}
            label={t('Project.labels.name')}
            required={props.isRequired('name')}
            onChange={props.onTextInputChange.bind(this, 'name')}
            value={props.item.name || ''}
          />
          <Form.TextArea
            error={props.isError('description')}
            label={t('Project.labels.description')}
            required={props.isRequired('description')}
            rows={5}
            onChange={props.onTextInputChange.bind(this, 'description')}
            value={props.item.description || ''}
          />
          <Form.Input
            error={props.isError('faircopy_cloud_url')}
            label={t('Project.labels.fairCopyCloudUrl')}
            required={props.isRequired('faircopy_cloud_url')}
            onChange={props.onTextInputChange.bind(this, 'faircopy_cloud_url')}
            value={props.item.faircopy_cloud_url || ''}
          />
          <Form.Input
            error={props.isError('faircopy_cloud_project_model_id')}
            label={t('Project.labels.faircopyCloudConnectedModel')}
            required={props.isRequired('faircopy_cloud_project_model_id')}
          >
            <AssociatedDropdown
              collectionName='project_models'
              onSearch={onSearch}
              onSelection={props.onAssociationInputChange.bind(
                this,
                'faircopy_cloud_project_model_id',
                'faircopy_cloud_project_model'
              )}
              renderOption={ProjectModelTransform.toDropdown.bind(this)}
              searchQuery={props.item.faircopy_cloud_project_model_id?.name}
              value={props.item.faircopy_cloud_project_model_id}
            />
          </Form.Input>
          <Form.Input
            error={props.isError('map_library_url')}
            label={t('Project.labels.mapLibraryUrl')}
            required={props.isRequired('map_library_url')}
            onChange={props.onTextInputChange.bind(this, 'map_library_url')}
            value={props.item.map_library_url || ''}
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
                  checked={props.item.discoverable}
                  className={styles.field}
                  label={t('Project.messages.share.content')}
                  error={props.isError('discoverable')}
                  onChange={props.onCheckboxInputChange.bind(this, 'discoverable')}
                />
              </Message.Content>
            </Message>
          </div>
          { PermissionsService.canArchiveProject() && (
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
                    checked={props.item.archived}
                    className={styles.field}
                    label={t('Project.messages.archive.content')}
                    error={props.isError('archived')}
                    onChange={props.onCheckboxInputChange.bind(this, 'archived')}
                  />
                </Message.Content>
              </Message>
            </div>
          )}
          { PermissionsService.canDeleteProject(props.item.id) && (
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
                  <Confirm
                    centered={false}
                    content={t('Project.messages.clear.content')}
                    header={t('Project.messages.clear.header')}
                    open={clearModal}
                    onCancel={() => setClearModal(false)}
                    onConfirm={onClear}
                  />
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
                  <Confirm
                    centered={false}
                    content={t('Project.messages.delete.content')}
                    header={t('Project.messages.delete.header')}
                    open={deleteModal}
                    onCancel={() => setDeleteModal(false)}
                    onConfirm={onDelete}
                  />
                </Segment>
              </SegmentGroup>
            </div>
          )}
        </SimpleEditPage.Tab>
      </SimpleEditPage>
    </>
  );
};
const Project: any = withReactRouterEditPage(ProjectForm, {
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

export default Project;
