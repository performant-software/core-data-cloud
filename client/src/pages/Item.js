// @flow

import React from 'react';
import ItemForm from '../components/ItemForm';
import ItemPage from '../components/ItemPage';
import ItemsService from '../services/Items';

const Item = () => (
  <ItemPage
    form={ItemForm}
    onInitialize={(id) => (
      ItemsService
        .fetchOne(id)
        .then(({ data }) => data.item)
    )}
    onSave={(item) => (
      ItemsService
        .save(item)
        .then(({ data }) => data.item)
    )}
  />
);

export default Item;
