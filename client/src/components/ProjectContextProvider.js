// @flow

import React, {
  useEffect,
  useMemo,
  useState,
  type Node
} from 'react';
import ProjectContext from '../context/Project';
import ProjectModelsService from '../services/ProjectModels';
import ProjectsService from '../services/Projects';
import useParams from '../hooks/ParsedParams';

type Props = {
  children: Node
};

const ProjectContextProvider = (props: Props) => {
  const [loadedProjectModels, setLoadedProjectModels] = useState(false);
  const [project, setProject] = useState();
  const [projectModel, setProjectModel] = useState();
  const [projectModels, setProjectModels] = useState();

  const { projectId, projectModelId } = useParams();

  /**
   * Load the project record based on the projectId parameter.
   */
  useEffect(() => {
    if (projectId) {
      ProjectsService
        .fetchOne(projectId)
        .then(({ data }) => setProject(data.project));
    } else {
      setProject(null);
    }
  }, [projectId]);

  /**
   * Load the project model record based on the projectModelId parameter.
   */
  useEffect(() => {
    if (projectModelId) {
      ProjectModelsService
        .fetchOne(projectModelId)
        .then(({ data }) => setProjectModel(data.project_model));
    } else {
      setProjectModel(null);
    }
  }, [projectModelId]);

  /**
   * Load the list of related project models based on the projectId parameter.
   */
  useEffect(() => {
    if (projectId) {
      ProjectModelsService
        .fetchAll({ project_id: projectId, sort_by: 'name' })
        .then(({ data }) => setProjectModels(data.project_models))
        .finally(() => setLoadedProjectModels(true));
    } else {
      setLoadedProjectModels(false);
      setProjectModels(null);
    }
  }, [projectId]);

  /**
   * Memo-ize the value to be set on the context.
   *
   * @type {{projectModel: unknown, project: unknown, projectModels: unknown}}
   */
  const value = useMemo(() => ({
    loadedProjectModels,
    project,
    projectModel,
    projectModels
  }), [loadedProjectModels, project, projectModel, projectModels]);

  return (
    <ProjectContext.Provider
      value={value}
    >
      { props.children }
    </ProjectContext.Provider>
  );
};

export default ProjectContextProvider;
