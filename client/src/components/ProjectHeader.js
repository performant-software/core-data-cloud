// @flow

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import type { Project as ProjectType } from '../types/Project';
import styles from './ProjectHeader.module.css';

type Props = {
  project: ProjectType
};

const ProjectHeader = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.projectHeader}
    >
      { props.project.name }
      <Dropdown
        className={cx(styles.ui, styles.dropdown)}
        direction='left'
        icon={(
          <Icon
            className={styles.icon}
            color='grey'
            name='ellipsis vertical'
          />
        )}
      >
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            content={t('ProjectHeader.labels.edit')}
            icon='edit'
            to={`${props.project.id}/edit`}
          />
          { PermissionsService.canEditProject(props.project.id) && (
            <Dropdown.Item
              as={Link}
              content={t('ProjectHeader.labels.settings')}
              icon='cog'
              to={`${props.project.id}`}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ProjectHeader;
