// @flow

import React, { useContext } from 'react';
import Organizations from '../pages/Organizations';
import People from '../pages/People';
import Places from '../pages/Places';
import ProjectContext from '../context/Project';
import { Types } from '../utils/ProjectModels';

const ListPageFactory = () => {
  const { projectModel } = useContext(ProjectContext);
  const className = projectModel?.model_class_view;

  if (!className) {
    return null;
  }

  let component;

  switch (className) {
    case Types.Organization:
      component = <Organizations />;
      break;

    case Types.Person:
      component = <People />;
      break;

    case Types.Place:
      component = <Places />;
      break;

    default:
      component = null;
      break;
  }

  return component;
};

export default ListPageFactory;
