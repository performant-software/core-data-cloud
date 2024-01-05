// flow

import React, { useMemo } from 'react';
import RelatedInstance from './RelatedInstance';
import RelatedItem from './RelatedItem';
import RelatedMediaContent from './RelatedMediaContent';
import RelatedOrganization from './RelatedOrganization';
import RelatedPerson from './RelatedPerson';
import RelatedPlace from './RelatedPlace';
import RelatedTaxonomyItem from './RelatedTaxonomyItem';
import RelatedWork from './RelatedWork';
import { Types } from '../utils/ProjectModels';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const ProjectModelRelationshipFactory = (props) => {
  const { projectModelRelationship } = useProjectModelRelationship();

  /**
   * Memo-izes the component to render based on the current project model relationship.
   *
   * @type {any}
   */
  const value = useMemo(() => {
    let component;

    const classView = projectModelRelationship.inverse
      ? projectModelRelationship?.primary_model?.model_class_view
      : projectModelRelationship?.related_model?.model_class_view;

    switch (classView) {
      case Types.Instance:
        component = (
          <RelatedInstance
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Item:
        component = (
          <RelatedItem
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.MediaContent:
        component = (
          <RelatedMediaContent
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Organization:
        component = (
          <RelatedOrganization
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Person:
        component = (
          <RelatedPerson
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Place:
        component = (
          <RelatedPlace
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Taxonomy:
        component = (
          <RelatedTaxonomyItem
            relationshipId={props.relationshipId}
          />
        );
        break;

      case Types.Work:
        component = (
          <RelatedWork
            relationshipId={props.relationshipId}
          />
        );
        break;

      default:
        component = null;
        break;
    }

    return component;
  }, [projectModelRelationship]);

  return value;
};

export default ProjectModelRelationshipFactory;
