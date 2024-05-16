// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProjectModelsService from '../services/ProjectModels';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import useParams from '../hooks/ParsedParams';

const ProjectModels = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

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
