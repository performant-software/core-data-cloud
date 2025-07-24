// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Breadcrumb } from 'semantic-ui-react';
import ProjectContext from '../context/Project';
import styles from './ProjectTitle.module.css';

const ProjectTitle = () => {
  const { project } = useContext(ProjectContext);
  const { t } = useTranslation();

  if (!project) {
    return null;
  }

  return (
    <Breadcrumb
      className={cx(styles.projectTitle, styles.ui, styles.breadcrumb)}
    >
      <Breadcrumb.Section
        as={Link}
        link
        to='/projects'
      >
        { t('ProjectTitle.labels.allProjects') }
      </Breadcrumb.Section>
      <Breadcrumb.Divider
        className={styles.divider}
      />
      <Breadcrumb.Section
        className={cx(styles.section, styles.projectName)}
      >
        { project.name }
      </Breadcrumb.Section>
    </Breadcrumb>
  );
};

export default ProjectTitle;
