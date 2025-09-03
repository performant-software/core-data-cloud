// @flow

import { ItemList, ItemViews } from '@performant-software/semantic-components';
import cx from 'classnames';
import React, { type AbstractComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router';
import { Icon } from 'semantic-ui-react';
import PermissionsService from '../services/Permissions';
import ProjectDescription from '../components/ProjectDescription';
import ProjectsService from '../services/Projects';
import { SlLock } from 'react-icons/sl';
import styles from './Projects.module.css';

const Projects: AbstractComponent<any> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { saved } = location?.state || {};

  /**
   * Memo-izes the add button value based on the current user's permissions.
   *
   * @type {{basic: boolean, color: string, location: string, onClick: (function(): void)}}
   */
  const addButton = useMemo(() => (
    PermissionsService.canCreateProject() ? ({
      basic: false,
      color: 'blue',
      location: 'top',
      onClick: () => navigate('new')
    }) : undefined
  ), []);

  return (
    <ItemList
      addButton={addButton}
      as={Link}
      asProps={(project) => ({
        className: cx(
          styles.card,
          { [styles.disabled]: project.archived && !PermissionsService.canArchiveProject() }
        ),
        raised: true,
        to: `${project.id}/edit`
      })}
      basic={false}
      className={styles.projects}
      collectionName='projects'
      defaultView={ItemViews.grid}
      hideToggle
      link
      renderHeader={(project) => project.name}
      renderDescription={(project) => (
        <ProjectDescription
          project={project}
        />
      )}
      renderEmptyList={() => null}
      renderExtra={(project) => (
        <div
          className={styles.icons}
        >
          { project.archived && (
            <Icon
              circular
              color='grey'
              inverted
              size='small'
            >
              <SlLock />
            </Icon>
          )}
          { project.discoverable && (
            <Icon
              circular
              color='blue'
              inverted
              size='small'
            >
              <IoSearchOutline />
            </Icon>
          )}
        </div>
      )}
      onLoad={(params) => ProjectsService.fetchAll(params)}
      saved={saved}
      session={{
        key: 'projects',
        storage: localStorage
      }}
      sort={[{
        key: 'name',
        value: 'core_data_connector_projects.name',
        text: t('Projects.sort.name')
      }, {
        key: 'projects.created_at',
        value: 'core_data_connector_projects.created_at',
        text: t('Projects.sort.created')
      }, {
        key: 'projects.updated_at',
        value: 'core_data_connector_projects.updated_at',
        text: t('Projects.sort.updated')
      }]}
      sortColor='blue'
    />
  );
};

export default Projects;
