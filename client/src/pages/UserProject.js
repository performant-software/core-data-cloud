// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import Project from '../transforms/Project';
import ProjectsService from '../services/Projects';
import User from '../transforms/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UsersService from '../services/Users';

type Props = EditContainerProps & {
  item: UserProjectType
};

const UserProjectForm = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();

  /*
 * For a new record, set the foreign key ID based on the route parameters.
 */
  useEffect(() => {
    if (!props.item.id) {
      if (params.projectId) {
        props.onSetState({ project_id: params.projectId });
      } else if (params.userId) {
        props.onSetState({ user_id: params.userId });
      }
    }
  }, []);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        { params.userId && (
          <Form.Input
            error={props.isError('project_id')}
            label={t('UserProject.labels.project')}
            required
          >
            <AssociatedDropdown
              collectionName='projects'
              onSearch={(search) => ProjectsService.fetchAll({ search })}
              onSelection={props.onAssociationInputChange.bind(this, 'project_id', 'project')}
              renderOption={(project) => Project.toDropdown(project)}
              searchQuery={props.item.project?.name}
              value={props.item.project_id}
            />
          </Form.Input>
        )}
        { params.projectId && (
          <Form.Input
            error={props.isError('user_id')}
            label={t('UserProject.labels.user')}
            required
          >
            <AssociatedDropdown
              collectionName='users'
              onSearch={(search) => UsersService.fetchAll({ search })}
              onSelection={props.onAssociationInputChange.bind(this, 'user_id', 'user')}
              renderOption={(user) => User.toDropdown(user)}
              searchQuery={props.item.user?.name}
              value={props.item.user_id}
            />
          </Form.Input>
        )}
        <Form.Dropdown
          error={props.isError('role')}
          label={t('UserProject.labels.role')}
          onChange={props.onTextInputChange.bind(this, 'role')}
          options={UserProjectRoles.getRoleOptions()}
          required={props.isRequired('role')}
          selection
          selectOnBlur={false}
          value={props.item.role}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const UserProject: AbstractComponent<any> = withReactRouterEditPage(UserProjectForm, {
  id: 'userProjectId',
  onInitialize: (id) => (
    UserProjectsService
      .fetchOne(id)
      .then(({ data }) => data.user_project)
  ),
  onSave: (userProject) => (
    UserProjectsService
      .save(userProject)
      .then(({ data }) => data.user_project)
  ),
  required: ['project_id', 'user_id', 'role'],
  resolveValidationError: ({ key, error }) => ({ [key]: error })
});

export default UserProject;
