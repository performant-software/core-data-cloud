// @flow

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Menu } from 'semantic-ui-react';
import _ from 'underscore';
import MenuLink from './MenuLink';
import ProjectContext from '../context/Project';
import useParams from '../hooks/ParsedParams';

const ProjectItemMenu = () => {
  const { projectId, projectModelId, itemId } = useParams();
  const { projectModel } = useContext(ProjectContext);
  const { t } = useTranslation();

  if (!itemId) {
    return null;
  }

  return (
    <Menu
      secondary
    >
      <MenuLink
        to={`/projects/${projectId}/${projectModelId}`}
      >
        <Icon
          name='arrow left'
        />
        { t('ProjectItemMenu.labels.backToAll', { name: projectModel.name }) }
      </MenuLink>
      <MenuLink
        content={t('ProjectItemMenu.labels.details')}
        to={`/projects/${projectId}/${projectModelId}/${itemId}`}
      />
      { _.map(projectModel.project_model_relationships, (relationship) => (
        <MenuLink
          content={relationship.name}
          parent
          to={`/projects/${projectId}/${projectModelId}/${itemId}/${relationship.id}`}
        />
      ))}
    </Menu>
  );
};

export default ProjectItemMenu;
