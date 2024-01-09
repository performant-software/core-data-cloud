// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
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
  Icon,
  Message
} from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import { type Project as ProjectType } from '../types/Project';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import ProjectsService from '../services/Projects';
import styles from './Project.module.css';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: ProjectType
};

const ProjectForm = (props: Props) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <>
      <ProjectSettingsMenu />
      <SimpleEditPage
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
            value={props.item.name}
          />
          <Form.TextArea
            error={props.isError('description')}
            label={t('Project.labels.description')}
            required={props.isRequired('description')}
            rows={5}
            onChange={props.onTextInputChange.bind(this, 'description')}
            value={props.item.description}
          />
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
          { PermissionsService.canDeleteProject(props.item.id) && (
            <>
              <Button
                color='red'
                content={t('Common.buttons.delete')}
                floated='right'
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
            </>
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
