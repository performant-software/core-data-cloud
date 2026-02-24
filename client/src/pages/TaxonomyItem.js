// @flow

import React from 'react';
import ItemPage from '../components/ItemPage';
import TaxonomiesService from '../services/Taxonomies';
import TaxonomyItemForm from '../components/TaxonomyItemForm';

const TaxonomyItem = () => (
  <ItemPage
    form={TaxonomyItemForm}
    onCreateManifests={(id, params) => (
      TaxonomiesService
        .createManifests(id, params)
    )}
    onInitialize={(id) => (
      TaxonomiesService
        .fetchOne(id)
        .then(({ data }) => data.taxonomy)
    )}
    onSave={(taxonomyItem) => (
      TaxonomiesService
        .save(taxonomyItem)
        .then(({ data }) => data.taxonomy)
    )}
  />
);

export default TaxonomyItem;
