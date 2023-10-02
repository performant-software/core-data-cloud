// @flow

import { createContext } from 'react';
import type { Project as ProjectType } from '../types/Project';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';

type ProjectContextType = {
  project: ProjectType,
  projectModel: ProjectModelType,
  projectModels: Array<ProjectModelType>
};

const ProjectContext = createContext<ProjectContextType>({
  project: undefined,
  projectModel: undefined,
  projectModels: undefined
});

export default ProjectContext;
