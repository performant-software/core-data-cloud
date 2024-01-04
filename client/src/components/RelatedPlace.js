// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import ListViews from '../constants/ListViews';
import PlaceTransform from '../transforms/Place';
import PlacesService from '../services/Places';
import RelatedPlaceModal from './RelatedPlaceModal';
import RelatedViewMenu from './RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship } from '../hooks/Relationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedPlaceForm = (props: Props) => {
  const [view, setView] = useState(ListViews.all);

  const { foreignProjectModelId } = useProjectModelRelationship();
  const {
    error,
    foreignKey,
    foreignObject,
    onSave,
    onSelection
  } = useRelationship(props);

  /**
   * Calls the GET API endpoint for places.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    PlacesService.fetchAll({
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
            content: null,
            name: 'clear'
          }]}
          collectionName='places'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          onSearch={onSearch}
          onSelection={onSelection}
          modal={{
            component: RelatedPlaceModal,
            props: {
              item: {
                id: props.item.id
              },
              onInitialize: props.onInitialize,
              required: [foreignKey]
            },
            onSave
          }}
          renderOption={PlaceTransform.toDropdown.bind(this)}
          searchQuery={foreignObject?.name}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedPlace = withRelationshipEditForm(RelatedPlaceForm);
export default RelatedPlace;
