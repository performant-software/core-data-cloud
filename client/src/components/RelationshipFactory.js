// @flow

import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import _ from 'underscore';
import Relationships from '../pages/Relationships';
import RelationshipsService from '../services/Relationships';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const RelationshipFactory = () => {
  const [loaded, setLoaded] = useState(false);
  const [relationships, setRelationships] = useState();

  const { itemId, projectModelRelationshipId } = useParams();
  const { primaryClass, projectModelRelationship } = useProjectModelRelationship();

  /**
   * Memo-izes the parameters for fetching the list of relationships.
   *
   * @type {{
   *   defineable_type: string,
   *   project_model_relationship_id: *,
   *   primary_record_id: *,
   *   primary_record_type: *,
   *   defineable_id: *
   * }}
   */
  const params = useMemo(() => ({
    project_model_relationship_id: projectModelRelationshipId,
    primary_record_id: itemId,
    primary_record_type: primaryClass,
    defineable_id: projectModelRelationshipId,
    defineable_type: 'CoreDataConnector::ProjectModelRelationship'
  }), [projectModelRelationshipId, itemId, primaryClass]);

  /**
   * For a relationship that only allows a single value, load the relationships. We'll need the ID value
   * to determine where to redirect.
   */
  useEffect(() => {
    /*
     * If the model allows multiple relationships, there's no need to load the relationships here. That will
     * be handled in the relationships page.
     */
    if (projectModelRelationship.multiple) {
      return;
    }

    RelationshipsService
      .fetchAll(params)
      .then(({ data }) => setRelationships(data.relationships))
      .finally(() => setLoaded(true));
  }, [params, projectModelRelationship?.multiple]);

  /**
   * If the relationship allows multiple values, render the relationships page.
   */
  if (projectModelRelationship.multiple) {
    return (
      <Relationships />
    );
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

export default RelationshipFactory;
