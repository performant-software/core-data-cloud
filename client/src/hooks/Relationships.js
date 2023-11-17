// @flow

import { useCallback } from 'react';
import useProjectModelRelationship from './ProjectModelRelationship';
import _ from 'underscore';

const useRelationships = () => {
  const { projectModelRelationship } = useProjectModelRelationship();

  /**
   * Returns the attribute value on the related object for the passed relationship.
   *
   * @type {function(*, *): *}
   */
  const resolveAttributeValue = useCallback((attribute, relationship) => {
    const record = projectModelRelationship.inverse
      ? relationship.primary_record
      : relationship.related_record;

    if (record) {
      const attributeArray = attribute.split('.');
      return _.get(record, attributeArray);
    }

    return null;
  }, [projectModelRelationship.inverse]);

  return {
    resolveAttributeValue
  };
};

export default useRelationships;
