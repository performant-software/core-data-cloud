// @flow

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Event from '../pages/Event';
import Instance from '../pages/Instance';
import Item from '../pages/Item';
import MediaContent from '../pages/MediaContent';
import Organization from '../pages/Organization';
import PermissionsService from '../services/Permissions';
import Person from '../pages/Person';
import Place from '../pages/Place';
import ProjectContext from '../context/Project';
import TaxonomyItem from '../pages/TaxonomyItem';
import { Types } from '../utils/ProjectModels';
import useParams from '../hooks/ParsedParams';
import Work from '../pages/Work';

const ProjectModelFactory = () => {
  const { projectModel } = useContext(ProjectContext);
  const { projectId } = useParams();

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!PermissionsService.canEditProjectData(projectId)) {
    return (
      <Navigate
        replace
        to='/projects'
      />
    );
  }

  const className = projectModel?.model_class_view;

  if (!className) {
    return null;
  }

  let component;

  switch (className) {
    case Types.Event:
      component = <Event />;
      break;

    case Types.Instance:
      component = <Instance />;
      break;

    case Types.Item:
      component = <Item />;
      break;

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

    case Types.Taxonomy:
      component = <TaxonomyItem />;
      break;

    case Types.Work:
      component = <Work />;
      break;

    default:
      component = null;
      break;
  }

  return component;
};

export default ProjectModelFactory;
