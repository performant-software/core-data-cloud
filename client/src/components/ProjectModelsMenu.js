// @flow

import React, { useContext } from 'react';
import ProjectContext from '../context/Project';
import { Dropdown } from 'semantic-ui-react';
import useParams from '../hooks/ParsedParams';
import _ from 'underscore';
import { Link, useMatch } from 'react-router-dom';

const ProjectModelsMenu = () => {
  const { projectModels } = useContext(ProjectContext);
  const { projectId, projectModelId } = useParams();

  const projectModel = _.findWhere(projectModels, { id: projectModelId });

  /**
   * Returns the URL for the passed project model ID.
   *
   * @param id
   *
   * @returns {`projects/${number}/${string}`}
   */
  const getURL = (id) => `projects/${projectId}/${id}`;

  /**
   * Returns true if the passed project model ID is the current URL.
   *
   * @type {function(*): PathMatch<ParamParseKey<string>>}
   */
  const isActive = (id) => useMatch({ path: getURL(id), end: true });

  if (!projectModel) {
    return null;
  }

  return (
    <Dropdown
      text={projectModel.name}
    >
      <Dropdown.Menu>
        { _.map(projectModels, ({ id, name }) => (
          <Dropdown.Item
            active={isActive(id)}
            as={Link}
            content={name}
            to={getURL(id)}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProjectModelsMenu;
