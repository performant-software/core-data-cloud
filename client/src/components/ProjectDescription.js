// @flow

import React from 'react';
import styles from './ProjectDescription.module.css';
import type { Project as ProjectType } from '../types/Project';

type Props = {
  project: ProjectType
};

const ProjectDescription = (props: Props) => (
  <div
    className={styles.projectDescription}
  >
    { props.project.description }
  </div>
);

export default ProjectDescription;
