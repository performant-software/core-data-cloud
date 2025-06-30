// @flow

import React, { useContext, useMemo } from 'react';
import { Divider, Header } from 'semantic-ui-react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import type { ProjectModelRelationship } from '../types/ProjectModel';
import ProjectModelRelationshipContext from '../context/ProjectModelRelationship';
import ProjectModelRelationshipsFactory from './ProjectModelRelationshipsFactory';
import Section from './Section';
import useParams from '../hooks/ParsedParams';

type Props = {
  projectModelRelationship: ProjectModelRelationship
};

const Relationship = (props: Props) => {
  const { projectModelRelationship } = props;
  const value = useMemo(() => ({ projectModelRelationship }), [projectModelRelationship]);

  return (
    <ProjectModelRelationshipContext.Provider
      value={value}
    >
      <Section
        id={projectModelRelationship.id}
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
      </Section>
    </ProjectModelRelationshipContext.Provider>
  );
};

const Relationships = () => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();

  /**
   * Relationships are only visible for persisted records.
   */
  if (!itemId) {
    return null;
  }

  return _.map(projectModel.all_project_model_relationships, (projectModelRelationship) => (
    <Relationship
      key={projectModelRelationship.id}
      projectModelRelationship={projectModelRelationship}
    />
  ));
};

export default Relationships;
