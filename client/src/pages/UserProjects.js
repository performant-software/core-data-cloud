// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, {
  useEffect,
  useMemo,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ItemHeader from '../components/ItemHeader';
import PermissionsService from '../services/Permissions';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import UserEditMenu from '../components/UserEditMenu';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import UsersService from '../services/Users';
import useParams from '../hooks/ParsedParams';
import Validation from '../utils/Validation';

const UserProjects: AbstractComponent<any> = () => {
  const [user, setUser] = useState();

  const navigate = useNavigate();
  const { projectId, userId } = useParams();
  const { t } = useTranslation();

  const ids = useMemo(() => ({ project_id: projectId, user_id: userId }), [projectId, userId]);
  const editable = useMemo(() => PermissionsService.canEditProject(projectId), [projectId]);

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
          accept: () => editable,
          icon: 'times',
          name: 'delete'
        }]}
        addButton={editable ? {
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        } : undefined}
        columns={[{
          name: 'core_data_connector_projects.name',
          label: t('UserProjects.columns.project'),
          resolve: (userProject) => userProject?.project.name,
          sortable: true,
          hidden: !!projectId
        }, {
          name: 'core_data_connector_users.name',
          label: t('UserProjects.columns.user'),
          resolve: (userProject) => userProject?.user.name,
          sortable: true,
          hidden: !!userId
        }, {
          name: 'core_data_connector_user_projects.role',
          label: t('UserProjects.columns.role'),
          resolve: (userProject) => UserProjectRoles.getRoleView(userProject.role),
          sortable: true
        }]}
        collectionName='user_projects'
        defaultSort={projectId
          ? 'core_data_connector_users.name'
          : 'core_data_connector_projects.name'}
        onDelete={(userProject) => UserProjectsService.delete(userProject)}
        onLoad={(p) => UserProjectsService.fetchAll({ ...p, ...ids })}
        resolveErrors={Validation.resolveDeleteError.bind(this)}
        searchable
      />
    </>
  );
};

export default UserProjects;
