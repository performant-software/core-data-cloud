// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProjectModelsService from '../services/ProjectModels';
import useParams from '../hooks/ParsedParams';

const ProjectModels = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <ListTable
      actions={[{
        name: 'edit',
        onClick: (projectModel) => navigate(`${projectModel.id}`)
      }, {
        name: 'delete'
      }]}
      addButton={{
        location: 'top',
        onClick: () => navigate('new')
      }}
      collectionName='project_models'
      columns={[{
        name: 'name',
        label: t('ProjectModels.columns.name'),
        sortable: true
      }, {
        name: 'model_class_view',
        label: t('ProjectModels.columns.type'),
        sortable: true
      }]}
      onDelete={(projectModel) => ProjectModelsService.delete(projectModel)}
      onLoad={(params) => ProjectModelsService.fetchAll({ ...params, project_id: projectId })}
      searchable
    />
  );
};

export default ProjectModels;
