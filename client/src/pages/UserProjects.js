// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PermissionsService from '../services/Permissions';
import UserProjectRoles from '../utils/UserProjectRoles';
import UserProjectsService from '../services/UserProjects';
import Validation from '../utils/Validation';

const UserProjects: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();

  const ids = useMemo(() => ({ project_id: params.projectId, user_id: params.userId }), [params]);
  const projectId = useMemo(() => parseInt(params.projectId, 10), [params.projectId]);
  const editable = useMemo(() => PermissionsService.canEditUserProjects(projectId), [projectId]);

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
        name: 'projects.name',
        label: t('UserProjects.columns.project'),
        resolve: (userProject) => userProject?.project.name,
        sortable: true,
        hidden: !!params.projectId
      }, {
        name: 'users.name',
        label: t('UserProjects.columns.user'),
        resolve: (userProject) => userProject?.user.name,
        sortable: true,
        hidden: !!params.userId
      }, {
        name: 'user_projects.role',
        label: t('UserProjects.columns.role'),
        resolve: (userProject) => UserProjectRoles.getRoleView(userProject.role),
        sortable: true
      }]}
      collectionName='user_projects'
      onDelete={(userProject) => UserProjectsService.delete(userProject)}
      onLoad={(p) => UserProjectsService.fetchAll({ ...p, ...ids })}
      resolveErrors={Validation.resolveDeleteError.bind(this)}
      searchable
    />
  );
};

export default UserProjects;
