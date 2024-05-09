// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import RelatedTaxonomyItemModal from './RelatedTaxonomyItemModal';
import useRelationships from '../hooks/Relationships';
import { useTranslation } from 'react-i18next';

const RelatedTaxonomyItems = () => {
  const {
    actions,
    foreignKey,
    onDelete,
    onInitialize,
    onLoad,
    onSave,
    resolveAttributeValue
  } = useRelationships();

  const { t } = useTranslation();

  return (
    <ListTable
      actions={actions}
      addButton={{
        basic: false,
        color: 'dark gray',
        location: 'top'
      }}
      className='compact'
      collectionName='relationships'
      columns={[{
        name: 'name',
        label: t('RelatedTaxonomyItems.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'name'),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedTaxonomyItemModal,
        props: {
          onInitialize,
          required: [foreignKey]
        }
      }}
      onDelete={onDelete}
      onLoad={onLoad}
      onSave={onSave}
    />
  );
};

export default RelatedTaxonomyItems;
