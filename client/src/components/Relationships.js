// @flow

import React, { useContext } from 'react';
import ProjectContext from '../context/Project';
import ProjectModelRelationshipsFactory from './ProjectModelRelationshipsFactory';
import _ from 'underscore';
import ProjectModelRelationshipContext from '../context/ProjectModelRelationship';
import useParams from '../hooks/ParsedParams';
import { Divider, Header } from 'semantic-ui-react';

const Relationships = () => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();

  if (!itemId) {
    return null;
  }

  return _.map(projectModel.all_project_model_relationships, (projectModelRelationship) => (
    <ProjectModelRelationshipContext.Provider
      value={{ projectModelRelationship }}
    >
      <Divider
        section
      />
      <Header
        content={projectModelRelationship.inverse
          ? projectModelRelationship.inverse_name
          : projectModelRelationship.name}
      />
      <ProjectModelRelationshipsFactory />
    </ProjectModelRelationshipContext.Provider>
  ));
};

export default Relationships;
