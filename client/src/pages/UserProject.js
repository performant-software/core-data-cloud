// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useEffect, useMemo, type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import Project from '../transforms/Project';
import ProjectsService from '../services/Projects';
import User from '../transforms/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserForm from '../components/UserForm';
import UserModal from '../components/UserModal';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UsersService from '../services/Users';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import UserPassword from '../components/UserPassword';

type Props = EditContainerProps & {
  item: UserProjectType
};

const UserProjectForm = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();

  const isNew = useMemo(() => !props.item.id, [props.item.id]);
  const editable = useMemo(() => PermissionsService.canEditProject(props.item.project_id), [props.item.project_id]);

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
      editable={editable}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        { PermissionsService.canEditUsers() && params.userId && (
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
        { PermissionsService.canEditUsers() && params.projectId && (
          <Form.Input
            error={props.isError('user_id')}
            label={t('UserProject.labels.user')}
            required
          >
            <AssociatedDropdown
              collectionName='users'
              modal={{
                component: UserModal,
                onSave: (user) => (
                  UsersService
                    .save(user)
                    .then(({ data }) => data.user)
                )
              }}
              onSearch={(search) => UsersService.fetchAll({ search })}
              onSelection={props.onAssociationInputChange.bind(this, 'user_id', 'user')}
              renderOption={(user) => User.toDropdown(user)}
              searchQuery={props.item.user?.name}
              value={props.item.user_id}
            />
          </Form.Input>
        )}
        { PermissionsService.isOwner(props.item.project_id) && isNew && (
          <UserForm
            {...props}
          />
        )}
        { PermissionsService.isOwner(props.item.project_id) && !isNew && (
          <UserPassword
            {...props}
          />
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
  required: ['project_id', 'role'],
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default UserProject;
