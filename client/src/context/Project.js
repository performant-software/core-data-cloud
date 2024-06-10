// @flow

import { createContext } from 'react';
import type { Project as ProjectType } from '../types/Project';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';

type ProjectContextType = {
  loadedProjectModels: boolean,
  project: ProjectType,
  projectModel: ProjectModelType,
  projectModels: Array<ProjectModelType>,
  reloadProjectModels: boolean
};

const ProjectContext = createContext<ProjectContextType>({
  loadedProjectModels: false,
  project: undefined,
  projectModel: undefined,
  projectModels: undefined,
  reloadProjectModels: false
});

export default ProjectContext;
