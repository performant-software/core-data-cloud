// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, {
  useEffect,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import ItemHeader from '../components/ItemHeader';
import PermissionsService from '../services/Permissions';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import UserEditMenu from '../components/UserEditMenu';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UserRoles from '../utils/UserRoles';
import UsersService from '../services/Users';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';

const UserProjects: AbstractComponent<any> = () => {
  const [user, setUser] = useState();

  const navigate = useNavigate();
  const { projectId, userId } = useParams();
  const { t } = useTranslation();

  const ids = useMemo(() => ({ project_id: projectId, user_id: userId }), [projectId, userId]);

  /**
   * Memo-izes the columns to display in the list.
   *
   * @type {[]}
   */
  const columns = useMemo(() => {
    const value = [];

    if (!projectId) {
      value.push({
        name: 'core_data_connector_projects.name',
        label: t('UserProjects.columns.project'),
        resolve: (userProject) => userProject?.project.name,
        sortable: true
      });
    }

    if (!userId) {
      value.push({
        name: 'core_data_connector_users.name',
        label: t('UserProjects.columns.user'),
        resolve: (userProject) => userProject?.user.name,
        sortable: true
      });
    }

    value.push({
      name: 'core_data_connector_user_projects.role',
      label: t('UserProjects.columns.role'),
      resolve: (userProject) => UserProjectRoles.getRoleView(userProject.role),
      sortable: true
    });

    if (projectId && PermissionsService.canEditUsers()) {
      value.push({
        name: 'core_data_connector_users.role',
        label: t('UserProjects.columns.type'),
        resolve: (userProject) => UserRoles.getRoleView(userProject?.user?.role),
        sortable: true
      });
    }

    return value;
  }, [projectId, userId]);

  /**
   * Fetch the current yser so we can display the name in the ItemHeader component.
   */
  useEffect(() => {
    if (userId) {
      UsersService
        .fetchOne(userId)
        .then(({ data }) => setUser(data.user));
    }
  }, []);

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (projectId && !PermissionsService.canEditUserProjects(projectId)) {
    return (
      <Navigate
        replace
        to={`/projects/${projectId}/edit`}
      />
    );
  }

  /**
   * Return to the projects list if the user does not have permissions to edit users.
   */
  if (userId && !PermissionsService.canEditUsers()) {
    return (
      <Navigate
        replace
        to='/projects'
      />
    );
  }

  return (
    <>
      { userId && user && (
        <ItemHeader
          back={{
            label: t('UserProjects.labels.allUsers'),
            url: '/users'
          }}
          name={user.name}
        />
      )}
      { projectId && (
        <ProjectSettingsMenu />
      )}
      { userId && (
        <UserEditMenu />
      )}
      <ListTable
        actions={[{
          name: 'edit',
          icon: 'pencil',
          onClick: (item) => navigate(`${item.id}`)
        }, {
          icon: 'times',
          name: 'delete'
        }, {
          icon: 'arrow right',
          name: 'navigate',
          onClick: (item) => navigate(`/projects/${item.project_id}`)
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        columns={columns}
        collectionName='user_projects'
        defaultSort={projectId
          ? 'core_data_connector_users.name'
          : 'core_data_connector_projects.name'}
        onDelete={(userProject) => UserProjectsService.delete(userProject)}
        onLoad={(p) => UserProjectsService.fetchAll({ ...p, ...ids })}
        resolveErrors={Validation.resolveDeleteError.bind(this)}
        searchable
        session={{
          key: `user_projects_${projectId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default UserProjects;
