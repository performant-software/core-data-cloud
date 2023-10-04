// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { Header } from 'semantic-ui-react';
import ProjectContext from '../context/Project';
import styles from './ProjectTitle.module.css';

const ProjectTitle = () => {
  const { project } = useContext(ProjectContext);

  if (!project) {
    return null;
  }

  return (
    <Header
      className={cx(styles.projectTitle, styles.ui, styles.header)}
      content={project.name}
    />
  );
};

export default ProjectTitle;
