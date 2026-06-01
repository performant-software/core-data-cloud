import _ from 'underscore';

export const getNavigateUrl = (relationship, projectId) => {
  const projectModelId = resolveAttributeValue('project_model_id', relationship);
  const recordId = resolveAttributeValue('id', relationship);

  return `/projects/${projectId}/${projectModelId}/${recordId}`;
}

/**
 * Returns the attribute value on the related object for the passed relationship.
 *
 * @type {function(*, *, *): *}
 */
export const resolveAttributeValue = (attribute, relationship) => {
  let value;

  const record = resolveRecord(relationship);

  if (record) {
    const attributeArray = attribute.split('.');
    value = _.get(record, attributeArray);
  }

  return value;
};

/**
 * Resolves the related record.
 *
 * @type {function(*, *): Organization|Person|Place}
 */
export const resolveRecord = (projectModelRelationship, relationship) => (
  projectModelRelationship.inverse
    ? relationship.primary_record
    : relationship.related_record
);
