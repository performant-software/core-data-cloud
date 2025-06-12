// @flow

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import _ from 'underscore';
import PermissionsService from '../services/Permissions';
import ProjectContext from '../context/Project';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';

const ProjectEdit = () => {
  const { loadedProjectModels, projectModels } = useContext(ProjectContext);
  const { projectId } = useParams();

  /**
   * Navigate to the first model, if exists.
   */
  const projectModel = _.first(projectModels);

  if (!loadedProjectModels) {
    return null;
  }

  /**
   * Redirect to the projects page if the user does not have permissions to access the project settings or data.
   */
  if (!(PermissionsService.canEditProjectSettings(projectId) || PermissionsService.canEditProjectData(projectId))) {
    return <UnauthorizedRedirect />;
  }

  /**
   * Redirect to the project edit page if no models have been added.
   */
  if (loadedProjectModels && !projectModel) {
    return (
      <Navigate
        replace
        to={`/projects/${projectId}`}
      />
    );
  }

  return (
    <Navigate
      replace
      to={`/projects/${projectId}/${projectModel?.id}`}
    />
  );
};

export default ProjectEdit;
