// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import PermissionsService from '../services/Permissions';
import ProjectModelsService from '../services/ProjectModels';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';

const ProjectModels = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!PermissionsService.canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ProjectSettingsMenu />
      <ListTable
        actions={[{
          name: 'edit',
          icon: 'pencil',
          onClick: (projectModel) => navigate(`${projectModel.id}`)
        }, {
          name: 'delete',
          icon: 'times'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='project_models'
        columns={[{
          name: 'name',
          label: t('ProjectModels.columns.name'),
          sortable: true
        }, {
          name: 'model_class',
          label: t('ProjectModels.columns.type'),
          resolve: (projectModel) => projectModel.model_class_view,
          sortable: true
        }, {
          name: 'order',
          label: t('ProjectModels.columns.order'),
          sortable: true
        }, {
          name: 'uuid',
          label: t('Common.columns.uuid'),
          hidden: true
        }]}
        onDelete={(projectModel) => ProjectModelsService.delete(projectModel)}
        onLoad={(params) => ProjectModelsService.fetchAll({ ...params, project_id: projectId })}
        searchable
        session={{
          key: `project_models_${projectId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default ProjectModels;
