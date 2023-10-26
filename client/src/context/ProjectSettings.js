// @flow

import { createContext } from 'react';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import type { UserProject as UserProjectType } from '../types/UserProject';

type ProjectSettingsContextType = {
  projectModel: ProjectModelType,
  setProjectModel: (projectModel: ProjectModelType) => void,
  userProject: UserProjectType,
  setUserProject: (userProject: UserProjectType) => void
};

const ProjectSettingsContext = createContext<ProjectSettingsContextType>({
  projectModel: undefined,
  setProjectModel: undefined,
  userProject: undefined,
  setUserProject: undefined
});

export default ProjectSettingsContext;
