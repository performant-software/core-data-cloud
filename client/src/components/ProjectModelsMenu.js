// @flow

import cx from 'classnames';
import React, { useContext } from 'react';
import {
  Link,
  matchPath,
  useLocation,
  useMatch
} from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import type { ProjectModel as ProjectModelType } from '../types/ProjectModel';
import styles from './ProjectModelsMenu.module.css';
import useParams from '../hooks/ParsedParams';

type Props = {
  projectModel: ProjectModelType
};

const CONFIG_PATH = '/projects/:projectId/project_models/:projectModelId';

const DropdownItem = ({ projectModel }: Props) => {
  const url = `projects/${projectModel.project_id}/${projectModel.id}`;
  const isActive = useMatch({ path: `${url}/*`, end: true });

  return (
    <Dropdown.Item
      active={isActive}
      as={Link}
      content={projectModel.name}
      to={url}
    />
  );
};

const ProjectModelsMenu = () => {
  const { projectModels } = useContext(ProjectContext);
  const { pathname } = useLocation();
  const { projectModelId } = useParams();

  const currentModel = _.findWhere(projectModels, { id: projectModelId });
  const isConfigPath = !!matchPath({ path: CONFIG_PATH, end: true }, pathname);

  if (!currentModel || isConfigPath) {
    return null;
  }

  return (
    <Dropdown
      className={cx(styles.projectModelsMenu, styles.ui, styles.dropdown)}
      scrolling
      text={currentModel.name}
    >
      <Dropdown.Menu>
        { _.map(projectModels, (projectModel) => (
          <DropdownItem
            projectModel={projectModel}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProjectModelsMenu;
