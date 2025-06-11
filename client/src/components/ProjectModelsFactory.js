// @flow

import React, { useContext } from 'react';
import Events from '../pages/Events';
import Instances from '../pages/Instances';
import Items from '../pages/Items';
import MediaContents from '../pages/MediaContents';
import Organizations from '../pages/Organizations';
import People from '../pages/People';
import PermissionsService from '../services/Permissions';
import Places from '../pages/Places';
import ProjectContext from '../context/Project';
import TaxonomyItems from '../pages/TaxonomyItems';
import { Types } from '../utils/ProjectModels';
import UnauthorizedRedirect from './UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import Works from '../pages/Works';

const ProjectModelsFactory = () => {
  const { projectModel } = useContext(ProjectContext);
  const { projectId } = useParams();

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!PermissionsService.canEditProjectData(projectId)) {
    return <UnauthorizedRedirect />;
  }

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
