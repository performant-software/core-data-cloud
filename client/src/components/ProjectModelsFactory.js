// @flow

import React, { useContext } from 'react';
import Events from '../pages/Events';
import Instances from '../pages/Instances';
import Items from '../pages/Items';
import MediaContents from '../pages/MediaContents';
import Organizations from '../pages/Organizations';
import People from '../pages/People';
import Places from '../pages/Places';
import ProjectContext from '../context/Project';
import TaxonomyItems from '../pages/TaxonomyItems';
import Works from '../pages/Works';
import { Types } from '../utils/ProjectModels';

const ProjectModelsFactory = () => {
  const { projectModel } = useContext(ProjectContext);
  const className = projectModel?.model_class_view;

  if (!className) {
    return null;
  }

  let component;

  switch (className) {
    case Types.Event:
      component = <Events key={projectModel?.id} />;
      break;

    case Types.Instance:
      component = <Instances key={projectModel?.id} />;
      break;

    case Types.Item:
      component = <Items key={projectModel?.id} />;
      break;

    case Types.MediaContent:
      component = <MediaContents key={projectModel?.id} />;
      break;

    case Types.Organization:
      component = <Organizations key={projectModel?.id} />;
      break;

    case Types.Person:
      component = <People key={projectModel?.id} />;
      break;

    case Types.Place:
      component = <Places key={projectModel?.id} />;
      break;

    case Types.Taxonomy:
      component = <TaxonomyItems key={projectModel?.id} />;
      break;

    case Types.Work:
      component = <Works key={projectModel?.id} />;
      break;

    default:
      component = null;
      break;
  }

  return component;
};

export default ProjectModelsFactory;
