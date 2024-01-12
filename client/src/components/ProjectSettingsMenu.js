// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';

const ProjectSettingsMenu = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  return (
    <Menu
      secondary
    >
      <MenuLink
        content={t('ProjectSettingsMenu.labels.details')}
        to={`/projects/${projectId}`}
      />
      { projectId && (
        <>
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
          <MenuLink
            content={t('ProjectSettingsMenu.labels.import')}
            parent
            to={`/projects/${projectId}/import`}
          />
        </>
      )}
    </Menu>
  );
};

export default ProjectSettingsMenu;
