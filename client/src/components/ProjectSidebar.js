// @flow

import cx from 'classnames';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Menu, Ref } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import ProjectModelsService from '../services/ProjectModels';
import ProjectsService from '../services/Projects';
import styles from './ProjectSidebar.module.css';
import useParams from '../hooks/ParsedParams';
import ProjectContext from '../context/Project';

type Props = {
  context: {
    current: ?HTMLDivElement
  },
  offset?: number
};

const ProjectSidebar = (props: Props) => {
  const { project, projectModel, projectModels } = useContext(ProjectContext);
  const { projectId, projectModelId, itemId } = useParams();
  const { t } = useTranslation();

  const relationships = useMemo(() => (
    _.where(projectModel?.project_model_relationships, { multiple: true })
  ), [projectModel]);

  if (!project) {
    return null;
  }

  return (
    <Ref
      innerRef={props.context}
    >
      <Menu
        borderless
        className={cx(styles.projectSidebar, styles.ui, styles.vertical, styles.menu)}
        fixed='left'
        vertical
        style={{
          marginLeft: `${props.offset}px`
        }}
      >
        { project && (
          <>
            <Menu.Item
              className={styles.item}
              content={project.name}
              header
            />
            { PermissionsService.canEditProject(projectId) && (
              <>
                <MenuLink
                  className={styles.item}
                  content={t('ProjectSidebar.labels.details')}
                  to={`/projects/${projectId}`}
                />
                <MenuLink
                  className={styles.item}
                  content={t('ProjectSidebar.labels.settings')}
                  parent
                  to={`/projects/${projectId}/project_models`}
                />
                <MenuLink
                  className={styles.item}
                  content={t('ProjectSidebar.labels.users')}
                  parent
                  to={`/projects/${projectId}/user_projects`}
                />
              </>
            )}
            { _.map(projectModels, (pm) => (
              <MenuLink
                className={styles.item}
                parent
                to={`/projects/${projectId}/${pm.id}`}
              >
                { pm.name }
                { projectModel?.id === pm.id && itemId && (
                  <Menu.Menu
                    className={styles.menu}
                  >
                    <MenuLink
                      className={styles.item}
                      content={t('ProjectSidebar.labels.details')}
                      to={`/projects/${projectId}/${pm.id}/${itemId}`}
                    />
                    { _.map(relationships, (relationship) => (
                      <MenuLink
                        className={styles.item}
                        content={relationship.name}
                        parent
                        to={`/projects/${projectId}/${pm.id}/${itemId}/${relationship.id}`}
                      />
                    ))}
                  </Menu.Menu>
                )}
              </MenuLink>
            ))}
          </>
        )}
      </Menu>
    </Ref>
  );
};

export default ProjectSidebar;
