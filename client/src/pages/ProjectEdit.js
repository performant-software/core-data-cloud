// @flow

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import _ from 'underscore';
import ProjectContext from '../context/Project';
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
   * If the models have been loaded, but none exist, navigate to the project edit page.
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
