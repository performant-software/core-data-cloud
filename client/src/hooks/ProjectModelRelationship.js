// @flow

import { useContext, useMemo } from 'react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import useParams from './ParsedParams';

const useProjectModelRelationship = () => {
  const { projectModel } = useContext(ProjectContext);
  const { projectModelRelationshipId } = useParams();

  /**
   * Set the current relationship based on the current project model's relationships.
   */
  const projectModelRelationship = useMemo(() => (
    _.findWhere(projectModel.project_model_relationships, { id: projectModelRelationshipId })
  ), [projectModel, projectModelRelationshipId]);

  return {
    projectModelRelationship,
    projectId: projectModel?.project_id,
    primaryClass: projectModel?.model_class,
    relatedClass: projectModelRelationship?.related_model?.model_class,
    relatedClassView: projectModelRelationship?.related_model?.model_class_view,
  };
};

export default useProjectModelRelationship;
