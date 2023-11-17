// @flow

import { SimpleEditPage } from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import ItemsService from '../services/Items';
import type { Item as ItemType } from '../types/Item';
import ItemForm from '../components/ItemForm';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';

type Props = EditContainerProps & {
  item: ItemType
};

const ItemPage = (props: Props) => {
  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <ItemForm
          {...props}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const Item: AbstractComponent<any> = withReactRouterEditPage(ItemPage, {
  id: 'itemId',
  onInitialize: (id) => (
    ItemsService
      .fetchOne(id)
      .then(({ data }) => data.item)
  ),
  onSave: (item) => (
    ItemsService
      .save(item)
      .then(({ data }) => data.item)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default Item;
