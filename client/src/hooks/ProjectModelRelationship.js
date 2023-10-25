// @flow

import { useContext, useMemo } from 'react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import useParams from './ParsedParams';

const useProjectModelRelationship = () => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId, projectModelRelationshipId } = useParams();

  /**
   * Set the current relationship based on the current project model's relationships.
   */
  const projectModelRelationship = useMemo(() => ({
    ..._.findWhere(projectModel?.all_project_model_relationships, { id: projectModelRelationshipId })
  }), [projectModel, projectModelRelationshipId]);

  /**
   * Parameters to send on a fetch request for `relationships` records.
   *
   * @type {{
   *  record_id: *,
   *  inverse: *,
   *  defineable_type: string,
   *  project_model_relationship_id: *,
   *  record_type: *,
   *  defineable_id: *
   * }}
   */
  const parameters = useMemo(() => ({
    project_model_relationship_id: projectModelRelationship?.id,
    record_id: itemId,
    record_type: projectModel?.model_class,
    defineable_id: projectModelRelationship?.id,
    defineable_type: 'CoreDataConnector::ProjectModelRelationship',
    inverse: projectModelRelationship?.inverse
  }), [projectModel, projectModelRelationship, itemId]);

  return {
    parameters,
    projectModelRelationship
  };
};

export default useProjectModelRelationship;
