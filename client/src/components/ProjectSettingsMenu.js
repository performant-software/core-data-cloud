// @flow

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { Header, Icon, Menu } from 'semantic-ui-react';
import _ from 'underscore';
import MenuLink from './MenuLink';
import ProjectSettingsContext from '../context/ProjectSettings';

const PROJECT_MODEL_EDIT_PATHS = [
  '/projects/:projectId/project_models/new',
  '/projects/:projectId/project_models/:projectModelId'
];

const PROJECT_SETTINGS_PATHS = [
  '/projects/:projectId',
  '/projects/:projectId/project_models',
  '/projects/:projectId/user_projects'
];

const USER_PROJECTS_EDIT_PATHS = [
  '/projects/:projectId/user_projects/new',
  '/projects/:projectId/user_projects/:userProjectId'
];

const ProjectSettingsMenu = () => {
  const { projectModel, userProject } = useContext(ProjectSettingsContext);
  const { pathname } = useLocation();
  const { projectId } = useParams();
  const { t } = useTranslation();

  const isProjectModelEdit = _.some(PROJECT_MODEL_EDIT_PATHS, (pattern) => matchPath(pattern, pathname));
  const isProjectSettings = _.some(PROJECT_SETTINGS_PATHS, (pattern) => matchPath(pattern, pathname));
  const isUserProjectsEdit = _.some(USER_PROJECTS_EDIT_PATHS, (pattern) => matchPath(pattern, pathname));

  if (!(isProjectModelEdit || isProjectSettings || isUserProjectsEdit)) {
    return null;
  }

  return (
    <Menu
      secondary
    >
      { isProjectModelEdit && (
        <>
          <Menu.Item>
            <Header
              content={projectModel?.id
                ? projectModel.name
                : t('ProjectSettingsMenu.labels.newModel')}
            />
          </Menu.Item>
          <MenuLink
            to={`/projects/${projectId}/project_models`}
          >
            <Icon
              name='arrow left'
            />
            { t('ProjectSettingsMenu.labels.allModels') }
          </MenuLink>
        </>
      )}
      { isUserProjectsEdit && (
        <>
          <Menu.Item>
            <Header
              content={userProject?.user
                ? userProject.user.name
                : t('ProjectSettingsMenu.labels.newUser')}
            />
          </Menu.Item>
          <MenuLink
            to={`/projects/${projectId}/user_projects`}
          >
            <Icon
              name='arrow left'
            />
            { t('ProjectSettingsMenu.labels.allUsers') }
          </MenuLink>
        </>
      )}
      { isProjectSettings && (
        <>
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
        </>
      )}
    </Menu>
  );
};

export default ProjectSettingsMenu;
