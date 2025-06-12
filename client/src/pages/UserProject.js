// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useEffect, useMemo, type AbstractComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import ItemHeader from '../components/ItemHeader';
import ItemLayout from '../components/ItemLayout';
import PermissionsService from '../services/Permissions';
import Project from '../transforms/Project';
import ProjectsService from '../services/Projects';
import User from '../transforms/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserForm from '../components/UserForm';
import UserModal from '../components/UserModal';
import UserPassword from '../components/UserPassword';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UserRoles from '../utils/UserRoles';
import UsersService from '../services/Users';
import UserUtils from '../utils/User';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: UserProjectType
};

const UserProjectForm = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();

  /**
   * Memo-izes whether we're on a new record.
   *
   * @type {boolean}
   */
  const isNew = useMemo(() => !props.item.id, [props.item.id]);

  /**
   * Memo-izes if the current user is an owner of the current project.
   *
   * @type {boolean}
   */
  const isOwner = useMemo(() => PermissionsService.isOwner(props.item.project_id), [props.item.project_id]);

  /**
   * Memo-izes if the password is editable for the current user.
   */
  const isPasswordEditable = useMemo(() => {
    // Passwords for single sign on users cannot be changed
    if (UserUtils.isSingleSignOn(props.item.user?.email)) {
      return false;
    }

    let value = false;

    // Users with edit permissions on users can change a password
    if (PermissionsService.canEditUsers()) {
      value = true;
    }

    // Project owners can change a password for guest users
    if (isOwner && (isNew || UserRoles.isGuest(props.item.user))) {
      value = true;
    }

    return value;
  }, [isNew, isOwner, props.item.user]);

  /**
   * Callback fired when the project search is executed.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onProjectSearch = useCallback((search) => ProjectsService.fetchAll({ search }), []);

  /**
   * Callback fired when the user search is executed.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onUserSearch = useCallback((search) => UsersService.fetchAll({ search }), []);

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

  if (params.projectId && !PermissionsService.canEditUserProjects(params.projectId)) {
    return (
      <Navigate
        replace
        to={`/projects/${params.projectId}/edit`}
      />
    );
  }

  if (params.userId && !PermissionsService.canEditUsers()) {
    return (
      <Navigate
        replace
        to='/projects'
      />
    );
  }

  return (
    <ItemLayout>
      <ItemLayout.Header>
        { params.projectId && (
          <ItemHeader
            back={{
              label: t('UserProject.labels.allUsers'),
              url: `/projects/${params.projectId}/user_projects`
            }}
            name={props.item.user?.name}
          />
        )}
        { params.userId && (
          <ItemHeader
            back={{
              label: t('UserProject.labels.allProjects'),
              url: `/users/${params.userId}/user_projects`
            }}
            name={props.item.project?.name}
          />
        )}
      </ItemLayout.Header>
      <ItemLayout.Content>
        <SimpleEditPage
          {...props}
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
                  onSearch={onProjectSearch}
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
                  onSearch={onUserSearch}
                  onSelection={props.onAssociationInputChange.bind(this, 'user_id', 'user')}
                  renderOption={(user) => User.toDropdown(user)}
                  searchQuery={props.item.user?.name}
                  value={props.item.user_id}
                />
              </Form.Input>
            )}
            { !PermissionsService.canEditUsers() && isOwner && isNew && (
              <UserForm
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
            { isPasswordEditable && (
              <UserPassword
                {...props}
              />
            )}
          </SimpleEditPage.Tab>
        </SimpleEditPage>
      </ItemLayout.Content>
    </ItemLayout>
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
