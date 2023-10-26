// @flow

import React, { useMemo, type Node, useState } from 'react';
import ProjectSettingsContext from '../context/ProjectSettings';

type Props = {
  children: Node
};

const ProjectSettingsContextProvider = (props: Props) => {
  const [projectModel, setProjectModel] = useState();
  const [userProject, setUserProject] = useState();

  /**
   * Memo-ize the value.
   *
   * @type {{
   *  projectModel: unknown,
   *  setUserProject: function(): void,
   *  userProject: unknown,
   *  setProjectModel: function(): void
   * }}
   */
  const value = useMemo(() => ({
    projectModel,
    setProjectModel,
    userProject,
    setUserProject
  }), [projectModel, setProjectModel, userProject, setUserProject]);

  return (
    <ProjectSettingsContext.Provider
      value={value}
    >
      { props.children }
    </ProjectSettingsContext.Provider>
  );
};

export default ProjectSettingsContextProvider;
