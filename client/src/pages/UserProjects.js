// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PermissionsService from '../services/Permissions';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import Validation from '../utils/Validation';
import useParams from '../hooks/ParsedParams';

const UserProjects: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { projectId, userId } = useParams();
  const { t } = useTranslation();

  const ids = useMemo(() => ({ project_id: projectId, user_id: userId }), [projectId, userId]);
  const editable = useMemo(() => PermissionsService.canEditProject(projectId), [projectId]);

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (item) => navigate(`${item.id}`)
      }, {
        accept: () => editable,
        name: 'delete'
      }]}
      addButton={editable ? {
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
  );
};

export default UserProjects;
