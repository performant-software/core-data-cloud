// @flow

import { withEditPage } from '@performant-software/shared-components';
import React, { useCallback, useState } from 'react';
import RelationshipsService from '../services/Relationships';
import Validation from '../utils/Validation';

type Props = {
  relationshipId?: number
};

const withRelationshipEditForm = (WrappedComponent) => (props: Props) => {
  const [id, setId] = useState(props.relationshipId);

  /**
   * Sets the new ID on the state.
   *
   * @type {function(*): void}
   */
  const afterSave = useCallback((item: any) => setId(item.id), []);

  /**
   * Initializes the state based on the relationship ID.
   *
   * @type {function(): Promise<{readonly data?: *}>}
   */
  const onInitialize = useCallback(() => (
    RelationshipsService
      .fetchOne(id)
      .then(({ data }) => data.relationship)
  ), [id]);

  /**
   * Saves the passed relationship record.
   *
   * @type {function(*): Promise<{readonly data?: *}>}
   */
  const onSave = useCallback((relationship) => (
    RelationshipsService
      .save(relationship)
      .then(({ data }) => data.relationship)
  ), []);

  const EditPage = withEditPage(WrappedComponent, {
    afterSave,
    id,
    onInitialize,
    onSave,
    resolveValidationError: Validation.resolveUpdateError.bind(this)
  });

  return (
    <EditPage
      {...props}
    />
  );
};

export default withRelationshipEditForm;