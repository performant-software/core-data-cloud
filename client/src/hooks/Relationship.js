// @flow

import { useCallback, useMemo } from 'react';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';
import Validation from '../utils/Validation';
import withReactRouterEditPage from './ReactRouterEditPage';

const useRelationship = ({ item, onSetState }) => {
  const { itemId, projectModelRelationshipId } = useParams();
  const { primaryClass, projectModelRelationship, relatedClass } = useProjectModelRelationship();

  /**
   * Sets the relationship label as the singular version of the name.
   *
   * @type {string}
   */
  const label = useMemo(() => projectModelRelationship?.related_model?.name_singular, [projectModelRelationship]);

  /**
   * Sets the required fields on the state for a new record.
   *
   * @type {(function(): void)|*}
   */
  const onNewRecord = useCallback(() => {
    if (onSetState && !item?.id) {
      onSetState({
        project_model_relationship_id: projectModelRelationshipId,
        primary_record_id: itemId,
        primary_record_type: primaryClass,
        related_record_type: relatedClass
      });
    }
  }, [item, onSetState]);

  return {
    label,
    onNewRecord
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
