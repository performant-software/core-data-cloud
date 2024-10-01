// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import ListViews from '../constants/ListViews';
import InstanceTransform from '../transforms/Instance';
import InstancesService from '../services/Instances';
import RelatedInstanceModal from './RelatedInstanceModal';
import RelatedViewMenu from './RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  instance: RelationshipType
};

const RelatedInstanceForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    buttons,
    error,
    foreignKey,
    foreignObject,
    foreignObjectName,
    onSave,
    onSelection
  } = useRelationship(props);

  /**
   * Calls the GET API endpoint for instances.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    InstancesService.fetchAll({
      search,
      project_model_id: foreignProjectModelId,
      view
    })
  ), [foreignProjectModelId, view]);

  return (
    <Form>
      <Form.Input
        error={error}
      >
        <AssociatedDropdown
          buttons={buttons}
          collectionName='instances'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          modal={{
            component: RelatedInstanceModal,
            props: {
              item: {
                id: props.item.id,
                [foreignKey]: foreignObject?.id,
                [foreignObjectName]: foreignObject
              },
              onInitialize: props.onInitialize,
              required: [foreignKey]
            },
            onSave
          }}
          onSearch={onSearch}
          onSelection={onSelection}
          renderOption={InstanceTransform.toDropdown.bind(this)}
          searchQuery={foreignObject?.name}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedInstance = withRelationshipEditForm(RelatedInstanceForm);
export default RelatedInstance;
