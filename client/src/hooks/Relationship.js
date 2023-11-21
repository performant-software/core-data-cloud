// @flow

import { useContext, useEffect, useMemo } from 'react';
import ProjectContext from '../context/Project';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';
import Validation from '../utils/Validation';
import withReactRouterEditPage from './ReactRouterEditPage';

/**
 * Sets the required foreign keys on the state when creating a relationships record.
 *
 * @param item
 * @param onSetState
 */
const initialize = ({ item, onSetState }) => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();
  const { projectModelRelationship } = useProjectModelRelationship();

  useEffect(() => {
    if (onSetState && !item?.id) {
      if (projectModelRelationship.inverse) {
        onSetState({
          project_model_relationship_id: projectModelRelationship?.id,
          primary_record_type: projectModelRelationship?.primary_model?.model_class,
          related_record_id: itemId,
          related_record_type: projectModel?.model_class
        });
      } else {
        onSetState({
          project_model_relationship_id: projectModelRelationship?.id,
          primary_record_id: itemId,
          primary_record_type: projectModel?.model_class,
          related_record_type: projectModelRelationship?.related_model?.model_class
        });
      }
    }
  }, [item.id, itemId, projectModel, projectModelRelationship]);
};

/**
 * Sets the required foreign keys on the state when creating a primary record from within a relationship.
 *
 * @param item
 * @param onSetState
 */
const initializeRelated = ({ item, onSetState }) => {
  const { projectModelRelationship } = useProjectModelRelationship();

  useEffect(() => {
    if (onSetState && !item.id) {
      onSetState({
        project_model_id: projectModelRelationship.inverse
          ? projectModelRelationship.primary_model_id
          : projectModelRelationship.related_model_id
      });
    }
  }, [item.id, projectModelRelationship]);
};

const useRelationship = ({ item }) => {
  const { projectModelRelationship } = useProjectModelRelationship();

  /**
   * Returns the foreign key for the current relationship.
   *
   * @type {string}
   */
  const foreignKey = useMemo(() => (
    projectModelRelationship.inverse
      ? 'primary_record_id'
      : 'related_record_id'
  ), [projectModelRelationship]);

  /**
   * Returns the foreign object for the current relationship.
   *
   * @type {Organization|Person|Place}
   */
  const foreignObject = useMemo(() => (
    projectModelRelationship.inverse
      ? item.primary_record
      : item.related_record
  ), [item, projectModelRelationship]);

  /**
   * Returns the foreign object name for the current relationship.
   *
   * @type {string}
   */
  const foreignObjectName = useMemo(() => (
    projectModelRelationship.inverse
      ? 'primary_record'
      : 'related_record'
  ), [projectModelRelationship]);

  /**
   * Sets the relationship label as the singular version of the name.
   *
   * @type {string}
   */
  const label = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship.primary_model.name_singular
      : projectModelRelationship.related_model.name_singular
  ), [projectModelRelationship]);

  return {
    foreignKey,
    foreignObject,
    foreignObjectName,
    label
  };
};

const withRelationshipEditPage = (RelationshipForm) => withReactRouterEditPage(RelationshipForm, {
  id: 'relationshipId',
  onInitialize: (id) => (
    RelationshipsService
      .fetchOne(id)
      .then(({ data }) => data.relationship)
  ),
  onSave: (relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
  ),
  required: ['related_record_id'],
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export {
  initialize,
  initializeRelated,
  useRelationship,
  withRelationshipEditPage
};
