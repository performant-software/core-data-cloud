// flow

import React from 'react';
import RelatedMediaContent from '../pages/RelatedMediaContent';
import RelatedOrganization from '../pages/RelatedOrganization';
import RelatedPerson from '../pages/RelatedPerson';
import RelatedPlace from '../pages/RelatedPlace';
import { Types } from '../utils/ProjectModels';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

const ProjectModelRelationshipFactory = () => {
  const { relatedClassView } = useProjectModelRelationship();

  let component;

  switch (relatedClassView) {
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

    default:
      component = null;
      break;
  }

  return component;
};

export default ProjectModelRelationshipFactory;
