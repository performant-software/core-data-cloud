// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useRelationship } from '../hooks/Relationship';
import ListViews from '../constants/ListViews';
import RelatedViewMenu from './RelatedViewMenu';
import RelatedWorkModal from './RelatedWorkModal';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';
import WorkTransform from '../transforms/Work';
import WorksService from '../services/Works';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedWorkForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);
  const { foreignProjectModelId } = useProjectModelRelationship();

  const {
    error,
    foreignKey,
    foreignObject,
    foreignObjectName,
    onSave,
    onSelection
  } = useRelationship(props);

  /**
   * Calls the GET API endpoint for works.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    WorksService.fetchAll({
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
          buttons={[{
            accept: () => !!props.item[foreignKey],
            content: null,
            icon: 'pencil',
            name: 'edit'
          }, {
            accept: () => !props.item[foreignKey],
            content: null,
            icon: 'pencil',
            name: 'add'
          }, {
            accept: () => !props.item[foreignKey],
            content: null,
            name: 'clear'
          }]}
          collectionName='works'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          onSearch={onSearch}
          onSelection={onSelection}
          modal={{
            component: RelatedWorkModal,
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
          renderOption={WorkTransform.toDropdown.bind(this)}
          searchQuery={foreignObject?.primary_name?.name?.name}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedWork = withRelationshipEditForm(RelatedWorkForm);
export default RelatedWork;
