// @flow

import { useCallback, useContext, useMemo } from 'react';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';
import Validation from '../utils/Validation';
import withReactRouterEditPage from './ReactRouterEditPage';
import ProjectContext from '../context/Project';

const useRelationship = ({ item, onSetState }) => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();
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

  /**
   * Sets the required fields on the state for a new record.
   *
   * @type {(function(): void)|*}
   */
  const onNewRecord = useCallback(() => {
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
  }, [item, onSetState, projectModel, projectModelRelationship]);

  return {
    label,
    onNewRecord,
    foreignKey,
    foreignObject,
    foreignObjectName
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
  useRelationship,
  withRelationshipEditPage
};
