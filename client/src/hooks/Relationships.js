// @flow

import { useCallback, useMemo } from 'react';
import useProjectModelRelationship from './ProjectModelRelationship';
import RelationshipsService from '../services/Relationships';

const useRelationships = () => {
  const { parameters, projectModelRelationship } = useProjectModelRelationship();

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
   * Deletes the passed relationship.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onDelete = useCallback((relationship) => (
    RelationshipsService
      .delete(relationship)
  ), []);

  /**
   * Initializes the relationship with the passed ID.
   *
   * @type {function(*): Promise<{readonly data?: *}>}
   */
  const onInitialize = useCallback((id) => (
    RelationshipsService
      .fetchOne(id)
      .then(({ data }) => data.relationship)
  ), []);

  /**
   * Loads the list of relationships for the passed parameters.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onLoad = useCallback((params) => RelationshipsService.fetchAll({ ...params, ...parameters }), []);

  /**
   * Saves the passed relationship.
   *
   * @type {function(*): Promise<{readonly data?: *}>}
   */
  const onSave = useCallback((relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
  ), []);

  /**
   * Returns the attribute value on the related object for the passed relationship.
   *
   * @type {function(*, *): *}
   */
  const resolveAttributeValue = useCallback((attribute, relationship) => {
    let value;

    const record = projectModelRelationship.inverse
      ? relationship.primary_record
      : relationship.related_record;

    if (record) {
      value = record[attribute];
    }

    return value;
  }, [projectModelRelationship.inverse]);

  return {
    foreignKey,
    onDelete,
    onInitialize,
    onLoad,
    onSave,
    resolveAttributeValue
  };
};

export default useRelationships;
