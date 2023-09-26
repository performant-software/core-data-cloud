// @flow

import { createContext } from 'react';

const ProjectContext = createContext({
  project: undefined,
  setProject: undefined,
  projectModels: undefined,
  setProjectModels: undefined
});

export default ProjectContext;
