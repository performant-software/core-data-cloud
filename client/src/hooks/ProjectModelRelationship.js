// @flow

import { useEffect, useState } from 'react';
import _ from 'underscore';
import useParams from './ParsedParams';
import useProjectModel from './ProjectModel';

const useProjectModelRelationship = () => {
  const [projectModelRelationship, setProjectModelRelationship] = useState();
  const { projectModel } = useProjectModel();
  const { projectModelRelationshipId } = useParams();

  /**
   * Set the current relationship based on the current project model's relationships.
   */
  useEffect(() => {
    if (projectModel) {
      const relationship = _.findWhere(projectModel.project_model_relationships, { id: projectModelRelationshipId });
      setProjectModelRelationship(relationship);
    }
  }, [projectModel, projectModelRelationshipId]);

  return {
    projectModelRelationship,
    projectId: projectModel?.project_id,
    primaryClass: projectModel?.model_class,
    relatedClass: projectModelRelationship?.related_model?.model_class,
    relatedClassView: projectModelRelationship?.related_model?.model_class_view,
  };
};

export default useProjectModelRelationship;
