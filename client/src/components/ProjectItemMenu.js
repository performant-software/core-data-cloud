// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Menu } from 'semantic-ui-react';
import _ from 'underscore';
import CurrentRecordContext from '../context/CurrentRecord';
import CurrentRecordHeader from './CurrentRecordHeader';
import MenuLink from './MenuLink';
import ProjectContext from '../context/Project';
import styles from './ProjectItemMenu.module.css';
import useParams from '../hooks/ParsedParams';

const ProjectItemMenu = () => {
  const { isNewRecord } = useContext(CurrentRecordContext);
  const { projectModel } = useContext(ProjectContext);
  const { projectId, projectModelId, itemId } = useParams();
  const { t } = useTranslation();

  // Hide the menu if we're outside the context of a single record
  if (!(isNewRecord || itemId)) {
    return null;
  }

  return (
    <Menu
      className={cx(
        styles.projectItemMenu,
        styles.ui,
        styles.secondary,
        styles.menu
      )}
      secondary
    >
      <Menu.Item>
        <CurrentRecordHeader />
      </Menu.Item>
      <MenuLink
        to={`/projects/${projectId}/${projectModelId}`}
      >
        <Icon
          name='arrow left'
        />
        { t('ProjectItemMenu.labels.backToAll', { name: projectModel?.name }) }
      </MenuLink>
      { itemId && (
        <>
          <MenuLink
            content={t('ProjectItemMenu.labels.details')}
            to={`/projects/${projectId}/${projectModelId}/${itemId}`}
          />
          { _.map(projectModel?.all_project_model_relationships, (relationship) => (
            <MenuLink
              content={relationship.inverse
                ? relationship.inverse_name
                : relationship.name}
              parent
              to={`/projects/${projectId}/${projectModelId}/${itemId}/${relationship.id}`}
            />
          ))}
        </>
      )}

    </Menu>
  );
};

export default ProjectItemMenu;
