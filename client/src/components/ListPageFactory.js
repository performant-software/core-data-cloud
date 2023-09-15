// @flow

import React from 'react';
import Organizations from '../pages/Organizations';
import People from '../pages/People';
import Places from '../pages/Places';
import useProjectModel, { Types } from '../hooks/ProjectModel';

const ListPageFactory = () => {
  const { className } = useProjectModel();

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
