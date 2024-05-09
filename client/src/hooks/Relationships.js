// @flow

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import _ from 'underscore';
import RelationshipsService from '../services/Relationships';
import useParams from './ParsedParams';
import useProjectModelRelationship from './ProjectModelRelationship';

const useRelationships = () => {
  const navigate = useNavigate();
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
      const attributeArray = attribute.split('.');
      value = _.get(record, attributeArray);
    }

    return value;
  }, [projectModelRelationship.inverse]);

  /**
   * Navigates to the record on the other side of the passed relationship.
   *
   * @type {(function(*): void)|*}
   */
  const onNavigate = useCallback((relationship) => {
    const projectModelId = resolveAttributeValue('project_model_id', relationship);
    const recordId = resolveAttributeValue('id', relationship);

    navigate(`/projects/${projectId}/${projectModelId}/${recordId}`);
  }, [resolveAttributeValue]);

  /**
   * Sets the list of default actions for the related list.
   */
  const actions = useMemo(() => [{
    name: 'edit',
    icon: 'pencil'
  }, {
    name: 'delete',
    icon: 'times'
  }, {
    name: 'navigate',
    icon: 'arrow right',
    onClick: onNavigate,
    popup: {
      content: t('Common.actions.navigate.content'),
      title: t('Common.actions.navigate.title')
    }
  }], [onNavigate]);

  return {
    actions,
    foreignKey,
    onDelete,
    onInitialize,
    onLoad,
    onNavigate,
    onSave,
    resolveAttributeValue
  };
};

export default useRelationships;
