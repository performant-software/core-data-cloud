// @flow

import { useContext, useMemo } from 'react';
import ProjectContext from '../context/Project';
import ProjectModelRelationshipContext from '../context/ProjectModelRelationship';
import useParams from './ParsedParams';

const useProjectModelRelationship = () => {
  const { projectModel } = useContext(ProjectContext);
  const { projectModelRelationship } = useContext(ProjectModelRelationshipContext);
  const { itemId } = useParams();

  /**
   * Sets the project model ID for the "foreign" model.
   *
   * @type {number}
   */
  const foreignProjectModelId = useMemo(() => (
    projectModelRelationship?.inverse
      ? projectModelRelationship?.primary_model_id
      : projectModelRelationship?.related_model_id
  ), [projectModelRelationship]);

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
    foreignProjectModelId,
    parameters,
    projectModelRelationship
  };
};

export default useProjectModelRelationship;
