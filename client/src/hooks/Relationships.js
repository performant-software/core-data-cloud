// @flow

import { useCallback } from 'react';
import useProjectModelRelationship from './ProjectModelRelationship';

const useRelationships = () => {
  const { projectModelRelationship } = useProjectModelRelationship();

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
    resolveAttributeValue
  };
};

export default useRelationships;
