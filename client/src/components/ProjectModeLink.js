// @flow

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router';
import { Button } from 'semantic-ui-react';
import _ from 'underscore';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import StringUtils from '../utils/String';
import styles from './ProjectModeLink.module.css';
import useParams from '../hooks/ParsedParams';

const EDIT_PATH = '/projects/:projectId/:projectModelId/*';

const ProjectModeLink = () => {
  const { loadedProjectModels, projectModels } = useContext(ProjectContext);

  const { pathname } = useLocation();
  const { projectId } = useParams();
  const { t } = useTranslation();

  // Hide the link if the user does not have permissions to edit the project settings
  if (!(projectId && PermissionsService.canEditProjectSettings(projectId))) {
    return null;
  }

  // Hide the link if no models have been added to the project.
  if (loadedProjectModels && _.isEmpty(projectModels)) {
    return null;
  }

  /**
   * If we're currently in edit mode, link to settings. Otherwise link to edit mode.
   *
   * @type {PathMatch<ParamParseKey<"/projects/:projectId/:projectModelId/*">>}
   */
  const match = matchPath({ path: EDIT_PATH, end: true }, pathname);
  const isEditPath = StringUtils.isInteger(match?.params?.projectModelId);

  return (
    <Button.Group
      color='blue'
      size='small'
    >
      <Button
        active={isEditPath}
        as={Link}
        className={styles.projectModeLink}
        content={t('ProjectModeLink.labels.edit')}
        icon='pencil'
        to={`/projects/${projectId}/edit`}
      />
      <Button
        active={!isEditPath}
        as={Link}
        className={styles.projectModeLink}
        content={t('ProjectModeLink.labels.settings')}
        icon='cog'
        to={`/projects/${projectId}/project_models`}
      />
    </Button.Group>
  );
};

export default ProjectModeLink;
