// @flow

import { useContext, useMemo } from 'react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import useParams from './ParsedParams';

const useProjectModelRelationship = () => {
  const { projectModel } = useContext(ProjectContext);
  const { projectId, itemId, projectModelRelationshipId } = useParams();

  const primaryClass = projectModel?.model_class;

  const parameters = useMemo(() => ({
    project_model_relationship_id: projectModelRelationshipId,
    primary_record_id: itemId,
    primary_record_type: primaryClass,
    defineable_id: projectModelRelationshipId,
    defineable_type: 'CoreDataConnector::ProjectModelRelationship'
  }), [projectModelRelationshipId, itemId, primaryClass]);

  /**
   * Set the current relationship based on the current project model's relationships.
   */
  const projectModelRelationship = useMemo(() => (
    _.findWhere(projectModel?.project_model_relationships, { id: projectModelRelationshipId })
  ), [projectModel, projectModelRelationshipId]);

  /**
   * Sets the URL to navigate to the list of related records.
   *
   * @type {string}
   */
  const relatedClassUrl = useMemo(() => (
    `/projects/${projectId}/${projectModelRelationship?.related_model_id}`
  ), [projectId, projectModelRelationship]);

  return {
    parameters,
    projectModelRelationship,
    projectId: projectModel?.project_id,
    primaryClass: projectModel?.model_class,
    relatedClass: projectModelRelationship?.related_model?.model_class,
    relatedClassUrl,
    relatedClassView: projectModelRelationship?.related_model?.model_class_view
  };
};

export default useProjectModelRelationship;
