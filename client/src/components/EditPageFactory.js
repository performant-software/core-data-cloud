// @flow

import React from 'react';
import Organization from '../pages/Organization';
import Person from '../pages/Person';
import Place from '../pages/Place';
import useProjectModel, { Types } from '../hooks/ProjectModel';

const EditPageFactory = () => {
  const { className } = useProjectModel();

  if (!className) {
    return null;
  }

  let component;

  switch (className) {
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

export default EditPageFactory;
