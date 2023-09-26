// @flow

import React, { useEffect, useMemo, useState } from 'react';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';
import ProjectsService from '../services/Projects';
import ProjectModelsService from '../services/ProjectModels';

const ProjectContextProvider = (props) => {
  const [project, setProject] = useState();
  const [projectModel, setProjectModel] = useState();
  const [projectModels, setProjectModels] = useState();

  const { projectId, projectModelId } = useParams();

  useEffect(() => {
    if (projectId) {
      ProjectsService
        .fetchOne(projectId)
        .then(({ data }) => setProject(data.project));
    }
  }, [projectId]);

  useEffect(() => {
    if (projectModelId) {
      ProjectModelsService
        .fetchOne(projectModelId)
        .then(({ data }) => setProjectModel(data.project_model));
    }
  }, [projectModelId]);

  useEffect(() => {
    if (projectId) {
      ProjectModelsService
        .fetchAll({ project_id: projectId })
        .then(({ data }) => setProjectModels(data.project_models));
    }
  }, [projectId]);

  const value = useMemo(() => ({
    project,
    projectModel,
    projectModels
  }), [project, projectModel, projectModels]);

  return (
    <ProjectContext.Provider
      value={value}
    >
      { props.children }
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
