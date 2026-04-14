// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  type AbstractComponent, useContext
} from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'semantic-ui-react';
import ItemHeader from '../components/ItemHeader';
import ItemLayout from '../components/ItemLayout';
import usePermissions from '../hooks/Permissions';
import Project from '../transforms/Project';
import ProjectsService from '../services/Projects';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import User from '../transforms/User';
import type { UserProject as UserProjectType } from '../types/UserProject';
import UserForm from '../components/UserForm';
import UserModal from '../components/UserModal';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UsersService from '../services/Users';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';
import useReactRouterEditPage from '../hooks/useReactRouterEditPage';
import { AuthenticationContext } from '../context/Authentication';

type Props = EditContainerProps & {
  item: UserProjectType
};

const UserProject = (props: Props) => {
  const params = useParams();
  const { t } = useTranslation();
  const {
    canEditUserProjects,
    canEditUsers,
    isOwner: isOwnerPermission
  } = usePermissions();
  const { provider } = useContext(AuthenticationContext);

  const editPageProps = useReactRouterEditPage({
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
    resolveValidationError: Validation.resolveUpdateError
  });

  const { item, onSetState } = editPageProps;

  /**
   * Memo-izes whether we're on a new record.
   *
   * @type {boolean}
   */
  const isNew = useMemo(() => !item.id, [item.id]);

  /**
   * Memo-izes if the current user is an owner of the current project.
   *
   * @type {boolean}
   */
  const isOwner = useMemo(() => isOwnerPermission(item.project_id), [isOwnerPermission, item.project_id]);

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
    if (!item.id) {
      if (params.projectId) {
        onSetState({ project_id: params.projectId });
      } else if (params.userId) {
        onSetState({ user_id: params.userId });
      }
    }
  }, []);

  /**
   * Redirect to the project edit page if we're in a project context and the user cannot edit user projects.
   */
  if (params.projectId && !canEditUserProjects(params.projectId)) {
    return (
      <UnauthorizedRedirect
        to={`/projects/${params.projectId}/edit`}
      />
    );
  }

  /**
   * Redirect to the projects page if we're in a user context and the users cannot edit users.
   */
  if (params.userId && !canEditUsers()) {
    return <UnauthorizedRedirect />;
  }

  const modal = useMemo(() => {
    if (provider === 'local') {
      return {
        component: UserModal,
        onSave: (user) => (
          UsersService
            .save(user)
            .then(({ data }) => data.user)
        )
      }
    }
  }, [provider]);

  return (
    <ItemLayout>
      <ItemLayout.Header>
        { params.projectId && (
          <ItemHeader
            back={{
              label: t('UserProject.labels.allUsers'),
              url: `/projects/${params.projectId}/user_projects`
            }}
            name={item.user?.name}
          />
        )}
        { params.userId && (
          <ItemHeader
            back={{
              label: t('UserProject.labels.allProjects'),
              url: `/users/${params.userId}/user_projects`
            }}
            name={item.project?.name}
          />
        )}
      </ItemLayout.Header>
      <ItemLayout.Content>
        <SimpleEditPage
          {...props}
          {...editPageProps}
        >
          <SimpleEditPage.Tab
            key='default'
          >
            { canEditUsers() && params.userId && (
              <Form.Input
                error={editPageProps.isError('project_id')}
                label={t('UserProject.labels.project')}
                required
              >
                <AssociatedDropdown
                  collectionName='projects'
                  onSearch={onProjectSearch}
                  onSelection={editPageProps.onAssociationInputChange.bind(this, 'project_id', 'project')}
                  renderOption={(project) => Project.toDropdown(project)}
                  searchQuery={item.project?.name}
                  value={item.project_id}
                />
              </Form.Input>
            )}
            { canEditUsers() && params.projectId && (
              <Form.Input
                error={editPageProps.isError('user_id')}
                label={t('UserProject.labels.user')}
                required
              >
                <AssociatedDropdown
                  collectionName='users'
                  modal={modal}
                  onSearch={onUserSearch}
                  onSelection={editPageProps.onAssociationInputChange.bind(this, 'user_id', 'user')}
                  renderOption={(user) => User.toDropdown(user)}
                  searchQuery={item.user?.name}
                  value={item.user_id}
                />
              </Form.Input>
            )}
            { !canEditUsers() && isOwner && isNew && (
              <UserForm
                {...props}
                {...editPageProps}
                isNew
              />
            )}
            <Form.Dropdown
              error={editPageProps.isError('role')}
              label={t('UserProject.labels.role')}
              onChange={editPageProps.onTextInputChange.bind(this, 'role')}
              options={UserProjectRoles.getRoleOptions()}
              required={editPageProps.isRequired('role')}
              selection
              selectOnBlur={false}
              value={item.role}
            />
          </SimpleEditPage.Tab>
        </SimpleEditPage>
      </ItemLayout.Content>
    </ItemLayout>
  );
};

export default UserProject;
