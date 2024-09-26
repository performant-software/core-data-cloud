// @flow

import { useUserDefinedColumns } from '@performant-software/user-defined-fields';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';

const useRelationships = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();

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
   * Returns the foreign model key for the current relationship.
   *
   * @type {string}
   */
  const foreignModelKey = useMemo(() => (
    projectModelRelationship.inverse
      ? 'primary_model_id'
      : 'related_model_id'
  ), [projectModelRelationship]);

  /**
   * Returns the foreign model ID for the current relationship.
   */
  const foreignModelId = useMemo(() => (
    projectModelRelationship[foreignModelKey]
  ), [projectModelRelationship, foreignModelKey]);

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
   * Resolves the related record.
   *
   * @type {function(*): Organization|Person|Place}
   */
  const resolveRecord = useCallback((relationship) => (
    projectModelRelationship.inverse
      ? relationship.primary_record
      : relationship.related_record
  ), [projectModelRelationship]);

  /**
   * Returns the attribute value on the related object for the passed relationship.
   *
   * @type {function(*, *): *}
   */
  const resolveAttributeValue = useCallback((attribute, relationship) => {
    let value;

    const record = resolveRecord(relationship);

    if (record) {
      const attributeArray = attribute.split('.');
      value = _.get(record, attributeArray);
    }

    return value;
  }, [resolveRecord]);

  /**
   * Navigates to the record on the other side of the passed relationship.
   *
   * @type {(function(*): void)|*}
   */
  const navigateUrl = useCallback((relationship) => {
    const projectModelId = resolveAttributeValue('project_model_id', relationship);
    const recordId = resolveAttributeValue('id', relationship);

    return `/projects/${projectId}/${projectModelId}/${recordId}`;
  }, [resolveAttributeValue]);

  /**
   * Sets the list of default actions for the related list.
   */
  const actions = [{
    name: 'edit',
    icon: 'pencil'
  }, {
    name: 'delete',
    icon: 'times'
  }, {
    as: Link,
    asProps: (relationship) => ({
      to: navigateUrl(relationship)
    }),
    name: 'navigate',
    icon: 'arrow right',
    popup: {
      content: t('Common.actions.navigate.content'),
      title: t('Common.actions.navigate.title')
    }
  }, {
    as: Link,
    asProps: (relationship) => ({
      target: '_blank',
      to: navigateUrl(relationship)
    }),
    icon: 'external alternate',
    name: 'open',
    popup: {
      content: t('Common.actions.open.content'),
      title: t('Common.actions.open.title')
    }
  }];

  /**
   * Load user-defined fields for the current relationship and related model.
   */
  const {
    loading: loadingRelationshipColumns,
    userDefinedColumns: relationshipColumns
  } = useUserDefinedColumns(projectModelRelationship?.id, 'CoreDataConnector::ProjectModelRelationship');

  const {
    loading: loadingRecordColumns,
    userDefinedColumns: recordColumns
  } = useUserDefinedColumns(foreignModelId, 'CoreDataConnector::ProjectModel', { resolveRecord });

  return {
    actions,
    foreignKey,
    loading: loadingRecordColumns || loadingRelationshipColumns,
    onDelete,
    onInitialize,
    onLoad,
    onSave,
    projectModelRelationship,
    resolveAttributeValue,
    userDefinedColumns: [
      ...recordColumns,
      ...relationshipColumns
    ]
  };
};

export default useRelationships;
