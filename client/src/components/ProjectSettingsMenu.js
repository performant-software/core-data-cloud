// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';

const ProjectSettingsMenu = () => {
  const { projectId, projectModelId } = useParams();
  const { t } = useTranslation();

  if (!projectId || projectModelId) {
    return null;
  }

  return (
    <Menu
      secondary
    >
      <MenuLink
        to='/projects'
      >
        <Icon
          name='arrow left'
        />
        { t('ProjectSettingsMenu.labels.allProjects') }
      </MenuLink>
      <MenuLink
        content={t('ProjectSettingsMenu.labels.details')}
        to={`/projects/${projectId}`}
      />
      <MenuLink
        content={t('ProjectSettingsMenu.labels.configure')}
        parent
        to={`/projects/${projectId}/project_models`}
      />
      <MenuLink
        content={t('ProjectSettingsMenu.labels.users')}
        parent
        to={`/projects/${projectId}/user_projects`}
      />
    </Menu>
  );
};

export default ProjectSettingsMenu;
