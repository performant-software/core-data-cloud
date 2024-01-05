// @flow

import { AssociatedDropdown, SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useCallback, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { initialize, useRelationship, withRelationshipEditPage } from '../hooks/Relationship';
import ListViews from '../constants/ListViews';
import TaxonomyItemModal from './TaxonomyItemModal';
import TaxonomyTransform from '../transforms/Taxonomy';
import TaxonomiesService from '../services/Taxonomies';
import RelatedViewMenu from './RelatedViewMenu';
import type { Relationship as RelationshipType } from '../types/Relationship';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import withRelationshipEditForm from '../hooks/RelationshipEditForm';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedTaxonomyItemForm = (props: Props) => {
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
                id: props.item.id
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
