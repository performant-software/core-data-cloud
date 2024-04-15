// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import ProjectContext from '../context/Project';
import ProjectModeLink from './ProjectModeLink';
import ProjectModelsMenu from './ProjectModelsMenu';
import ProjectTitle from './ProjectTitle';
import styles from './ProjectMenuBar.module.css';

const ProjectMenuBar = () => {
  const { project } = useContext(ProjectContext);

  if (!project) {
    return null;
  }

  return (
    <Menu
      borderless
      className={cx(styles.projectMenuBar, styles.ui, styles.menu, styles.secondary)}
      secondary
    >
      <Menu.Item
        className={styles.item}
      >
        <ProjectTitle />
      </Menu.Item>
      <Menu.Item
        className={styles.item}
      >
        <ProjectModelsMenu />
      </Menu.Item>
      <Menu.Item
        className={styles.item}
        position='right'
      >
        <ProjectModeLink />
      </Menu.Item>
    </Menu>
  );
};

export default ProjectMenuBar;
