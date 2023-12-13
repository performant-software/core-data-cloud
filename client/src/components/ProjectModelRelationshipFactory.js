// flow

import React, { useMemo } from 'react';
import RelatedMediaContent from '../pages/RelatedMediaContent';
import RelatedOrganization from '../pages/RelatedOrganization';
import RelatedPerson from '../pages/RelatedPerson';
import RelatedPlace from '../pages/RelatedPlace';
import RelatedTaxonomyItem from '../pages/RelatedTaxonomyItem';
import { Types } from '../utils/ProjectModels';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const ProjectModelRelationshipFactory = () => {
  const { projectModelRelationship } = useProjectModelRelationship();

  /**
   * Sets the class view string based on the relationship's inverse status.
   *
   * @type {string}
   */
  const classView = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship?.primary_model?.model_class_view
      : projectModelRelationship?.related_model?.model_class_view
  ), [projectModelRelationship]);

  let component;

  switch (classView) {
    case Types.MediaContent:
      component = <RelatedMediaContent />;
      break;

    case Types.Organization:
      component = <RelatedOrganization />;
      break;

    case Types.Person:
      component = <RelatedPerson />;
      break;

    case Types.Place:
      component = <RelatedPlace />;
      break;

    case Types.Taxonomy:
      component = <RelatedTaxonomyItem />;
      break;

    default:
      component = null;
      break;
  }

  return component;
};

export default ProjectModelRelationshipFactory;
