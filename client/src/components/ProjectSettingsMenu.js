// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import useParams from '../hooks/ParsedParams';

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
          { PermissionsService.canEditUserProjects(projectId) && (
            <MenuLink
              content={t('ProjectSettingsMenu.labels.users')}
              parent
              to={`/projects/${projectId}/user_projects`}
            />
          )}
          <MenuLink
            content={t('ProjectSettingsMenu.labels.import')}
            parent
            to={`/projects/${projectId}/import`}
          />
          <MenuLink
            content={t('ProjectSettingsMenu.labels.authorities')}
            parent
            to={`/projects/${projectId}/web_authorities`}
          />
        </>
      )}
    </Menu>
  );
};

export default ProjectSettingsMenu;
