// @flow

import React, { useEffect, useMemo, useState } from 'react';
import _ from 'underscore';
import ProjectModelRelationshipFactory from './ProjectModelRelationshipFactory';
import RelatedEvents from './RelatedEvents';
import RelatedInstances from './RelatedInstances';
import RelatedItems from './RelatedItems';
import RelatedMediaContents from './RelatedMediaContents';
import RelatedOrganizations from './RelatedOrganizations';
import RelatedPeople from './RelatedPeople';
import RelatedPlaces from './RelatedPlaces';
import RelatedTaxonomyItems from './RelatedTaxonomyItems';
import RelatedWorks from './RelatedWorks';
import RelationshipsService from '../services/Relationships';
import { Types } from '../utils/ProjectModels';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const ProjectModelRelationshipsFactory = () => {
  const [loaded, setLoaded] = useState(false);
  const [relationships, setRelationships] = useState();

  const { parameters, projectModelRelationship } = useProjectModelRelationship();

  /**
   * Sets the class view prop based on the relationship's inverse status.
   *
   * @type {string}
   */
  const classView = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship?.primary_model?.model_class_view
      : projectModelRelationship?.related_model?.model_class_view
  ), [projectModelRelationship]);

  /**
   * Sets the multiple prop based on the relationship's inverse status.
   * @type {boolean|*}
   */
  const multiple = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship.inverse_multiple
      : projectModelRelationship.multiple
  ), [projectModelRelationship]);

  /**
   * For a relationship that only allows a single value, load the relationships. We'll need the ID value
   * to determine where to redirect.
   */
  useEffect(() => {
    /*
     * If the model allows multiple relationships, there's no need to load the relationships here. That will
     * be handled in the relationships page.
     */
    if (!projectModelRelationship || multiple) {
      return;
    }

    RelationshipsService
      .fetchAll(parameters)
      .then(({ data }) => setRelationships(data.relationships))
      .finally(() => setLoaded(true));
  }, [multiple, parameters, projectModelRelationship]);

  if (!projectModelRelationship) {
    return null;
  }

  if (multiple) {
    if (classView === Types.Event) {
      return (
        <RelatedEvents />
      );
    }

    if (classView === Types.Instance) {
      return (
        <RelatedInstances />
      );
    }

    if (classView === Types.Item) {
      return (
        <RelatedItems />
      );
    }

    if (classView === Types.MediaContent) {
      return (
        <RelatedMediaContents />
      );
    }

    if (classView === Types.Organization) {
      return (
        <RelatedOrganizations />
      );
    }

    if (classView === Types.Person) {
      return (
        <RelatedPeople />
      );
    }

    if (classView === Types.Place) {
      return (
        <RelatedPlaces />
      );
    }

    if (classView === Types.Taxonomy) {
      return (
        <RelatedTaxonomyItems />
      );
    }

    if (classView === Types.Work) {
      return (
        <RelatedWorks />
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

  const relationship = _.first(relationships);

  return (
    <ProjectModelRelationshipFactory
      relationshipId={relationship?.id}
    />
  );
};

export default ProjectModelRelationshipsFactory;
