// @flow

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import _ from 'underscore';
import RelatedMediaContents from '../pages/RelatedMediaContents';
import RelatedOrganizations from '../pages/RelatedOrganizations';
import RelatedPeople from '../pages/RelatedPeople';
import RelatedPlaces from '../pages/RelatedPlaces';
import RelationshipsService from '../services/Relationships';
import { Types } from '../utils/ProjectModels';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const ProjectModelRelationshipsFactory = () => {
  const [loaded, setLoaded] = useState(false);
  const [relationships, setRelationships] = useState();

  const { parameters, projectModelRelationship, relatedClassView } = useProjectModelRelationship();

  /**
   * For a relationship that only allows a single value, load the relationships. We'll need the ID value
   * to determine where to redirect.
   */
  useEffect(() => {
    /*
     * If the model allows multiple relationships, there's no need to load the relationships here. That will
     * be handled in the relationships page.
     */
    if (!projectModelRelationship || projectModelRelationship.multiple) {
      return;
    }

    RelationshipsService
      .fetchAll(parameters)
      .then(({ data }) => setRelationships(data.relationships))
      .finally(() => setLoaded(true));
  }, [parameters, projectModelRelationship?.multiple]);

  if (!projectModelRelationship) {
    return null;
  }

  if (projectModelRelationship.multiple) {
    if (relatedClassView === Types.MediaContent) {
      return (
        <RelatedMediaContents />
      );
    }

    if (relatedClassView === Types.Organization) {
      return (
        <RelatedOrganizations />
      );
    }

    if (relatedClassView === Types.Person) {
      return (
        <RelatedPeople />
      );
    }

    if (relatedClassView === Types.Place) {
      return (
        <RelatedPlaces />
      );
    }

    return null;
  }

  /**
   * If the relationship does not allow multiple values and we have not loaded the list of existing relationships,
   * return null.
   */
  if (!loaded) {
    return null;
  }

  /**
   * If a relationship exists, navigate to the edit page for that record.
   */
  const relationship = _.first(relationships);

  if (relationship) {
    return (
      <Navigate to={`${relationship.id}`} />

    );
  }

  /**
   * If no relationship exists, navigate to the edit page for a new relationship record.
   */
  return (
    <Navigate to='new' />
  );
};

export default ProjectModelRelationshipsFactory;
