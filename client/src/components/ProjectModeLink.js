// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import StringUtils from '../utils/String';
import styles from './ProjectModeLink.module.css';
import useParams from '../hooks/ParsedParams';

const EDIT_PATH = '/projects/:projectId/:projectModelId/*';

const ProjectModeLink = () => {
  const { pathname } = useLocation();
  const { projectId } = useParams();
  const { t } = useTranslation();

  if (!(projectId && PermissionsService.canEditProject(projectId))) {
    return null;
  }

  /**
   * If we're currently in edit mode, link to settings. Otherwise link to edit mode.
   *
   * @type {PathMatch<ParamParseKey<"/projects/:projectId/:projectModelId/*">>}
   */
  const match = matchPath({ path: EDIT_PATH, end: true }, pathname);
  const isEditPath = StringUtils.isInteger(match?.params?.projectModelId);

  if (isEditPath) {
    return (
      <Link
        className={styles.projectModeLink}
        to={`/projects/${projectId}/project_models`}
      >
        <Icon
          name='cog'
        />
        { t('ProjectModeLink.labels.settings')}
      </Link>
    );
  }

  return (
    <Link
      className={styles.projectModeLink}
      to={`/projects/${projectId}/edit`}
    >
      <Icon
        name='edit'
      />
      { t('ProjectModeLink.labels.edit') }
    </Link>
  );
};

export default ProjectModeLink;
