// @flow

import {
  SimpleEditPage
} from '@performant-software/semantic-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { type AbstractComponent } from 'react';
import initialize from '../hooks/Item';
import TaxonomiesService from '../services/Taxonomies';
import type { Taxonomy as TaxonomyType } from '../types/Taxonomy';
import Validation from '../utils/Validation';
import withReactRouterEditPage from '../hooks/ReactRouterEditPage';
import TaxonomyItemForm from '../components/TaxonomyItemForm';

type Props = EditContainerProps & {
  item: TaxonomyType
};

const TaxonomyItemPage = (props: Props) => {
  /**
   * Sets the current record and project model ID.
   */
  initialize(props);

  return (
    <SimpleEditPage
      {...props}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <TaxonomyItemForm
          {...props}
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const TaxonomyItem: AbstractComponent<any> = withReactRouterEditPage(TaxonomyItemPage, {
  id: 'itemId',
  onInitialize: (id) => (
    TaxonomiesService
      .fetchOne(id)
      .then(({ data }) => data.taxonomy)
  ),
  onSave: (taxonomyItem) => (
    TaxonomiesService
      .save(taxonomyItem)
      .then(({ data }) => data.taxonomy)
  ),
  resolveValidationError: Validation.resolveUpdateError.bind(this)
});

export default TaxonomyItem;
