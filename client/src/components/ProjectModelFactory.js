// @flow

import React, { useContext } from 'react';
import MediaContent from '../pages/MediaContent';
import Organization from '../pages/Organization';
import Person from '../pages/Person';
import Place from '../pages/Place';
import ProjectContext from '../context/Project';
import { Types } from '../utils/ProjectModels';

const ProjectModelFactory = () => {
  const { projectModel } = useContext(ProjectContext);
  const className = projectModel?.model_class_view;

  if (!className) {
    return null;
  }

  let component;

  switch (className) {
    case Types.MediaContent:
      component = <MediaContent />;
      break;

    case Types.Organization:
      component = <Organization />;
      break;

    case Types.Person:
      component = <Person />;
      break;

    case Types.Place:
      component = <Place />;
      break;

    default:
      component = null;
      break;
  }

  return component;
};

export default ProjectModelFactory;
