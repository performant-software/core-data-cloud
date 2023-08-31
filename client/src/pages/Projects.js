// @flow

import { ItemList, ItemViews } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import ProjectsService from '../services/Projects';

const Projects: AbstractComponent<any> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <ItemList
      addButton={{
        location: 'top',
        onClick: () => navigate('new')
      }}
      as={Link}
      asProps={(item) => ({
        to: `${item.id}`
      })}
      link
      collectionName='projects'
      defaultView={ItemViews.grid}
      hideToggle
      renderHeader={(project) => project.name}
      renderDescription={(project) => project.description}
      onLoad={(params) => ProjectsService.fetchAll(params)}
      sort={[{
        key: 'name',
        value: 'projects.name',
        text: t('Projects.sort.name')
      }, {
        key: 'projects.created_at',
        value: 'projects.created_at',
        text: t('Projects.sort.created')
      }, {
        key: 'projects.updated_at',
        value: 'projects.updated_at',
        text: t('Projects.sort.updated')
      }]}
    />
  );
};

export default Projects;
