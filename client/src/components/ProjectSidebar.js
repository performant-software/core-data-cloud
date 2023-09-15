// @flow

import cx from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Ref } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import ProjectModelsService from '../services/ProjectModels';
import ProjectsService from '../services/Projects';
import styles from './ProjectSidebar.module.css';
import useParams from '../hooks/ParsedParams';

type Props = {
  context: {
    current: ?HTMLDivElement
  },
  offset?: number
};

const ProjectSidebar = (props: Props) => {
  const [project, setProject] = useState();
  const [currentProjectModel, setCurrentProjectModel] = useState();
  const [projectModels, setProjectModels] = useState();

  const { projectId, projectModelId, itemId } = useParams();
  const { t } = useTranslation();

  const relationships = useMemo(() => (
    _.where(currentProjectModel?.project_model_relationships, { multiple: true })
  ), [currentProjectModel]);

  /**
   * Load the project.
   */
  useEffect(() => {
    ProjectsService
      .fetchOne(projectId)
      .then(({ data }) => setProject(data.project));
  }, []);

  /**
   * Load the related project models.
   */
  useEffect(() => {
    ProjectModelsService
      .fetchAll({ project_id: projectId })
      .then(({ data }) => setProjectModels(data.project_models));
  }, []);

  /**
   * Load the project model relationships.
   */
  useEffect(() => {
    if (projectModelId) {
      ProjectModelsService
        .fetchOne(projectModelId)
        .then(({ data }) => setCurrentProjectModel(data.project_model));
    }
  }, [projectModelId]);

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
            { _.map(projectModels, (projectModel) => (
              <MenuLink
                className={styles.item}
                parent
                to={`/projects/${projectId}/${projectModel.id}`}
              >
                { projectModel.name }
                { currentProjectModel?.id === projectModel.id && itemId && (
                  <Menu.Menu>
                    <MenuLink
                      className={styles.item}
                      content={t('ProjectSidebar.labels.details')}
                      to={`/projects/${projectId}/${projectModel.id}/${itemId}`}
                    />
                    { _.map(relationships, (relationship) => (
                      <MenuLink
                        className={styles.item}
                        content={relationship.name}
                        to={`/projects/${projectId}/${projectModel.id}/${itemId}/${relationship.id}`}
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
