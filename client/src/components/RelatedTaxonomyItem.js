// @flow

import { AssociatedDropdown } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { useRelationship } from '../hooks/Relationship';
import ListViews from '../constants/ListViews';
import RelatedTaxonomyItemModal from './RelatedTaxonomyItemModal';
import RelatedViewMenu from './RelatedViewMenu';
import TaxonomiesService from '../services/Taxonomies';
import TaxonomyTransform from '../transforms/Taxonomy';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedTaxonomyItemForm = (props: Props) => {
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
   * Calls the GET API endpoint for taxonomy items.
   *
   * @type {function(*): Promise<AxiosResponse<T>>|*}
   */
  const onSearch = useCallback((search) => (
    TaxonomiesService.fetchAll({
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
          collectionName='taxonomies'
          header={(
            <RelatedViewMenu
              onChange={(value) => setView(value)}
              value={view}
            />
          )}
          onSearch={onSearch}
          onSelection={onSelection}
          modal={{
            component: RelatedTaxonomyItemModal,
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
          renderOption={TaxonomyTransform.toDropdown.bind(this)}
          searchQuery={foreignObject?.name}
          value={props.item[foreignKey]}
        />
      </Form.Input>
    </Form>
  );
};

const RelatedTaxonomyItem = withRelationshipEditForm(RelatedTaxonomyItemForm);
export default RelatedTaxonomyItem;
