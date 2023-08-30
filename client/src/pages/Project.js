// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Confirm, Form } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import { type Project as ProjectType } from '../types/Project';
import ProjectsService from '../services/Projects';
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
    <SimpleEditPage
      {...props}
      editable={PermissionsService.canEditProject(props.item.id)}
      menuProps={{
        text: true
      }}
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
