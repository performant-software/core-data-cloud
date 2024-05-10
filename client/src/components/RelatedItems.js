// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RelatedItemModal from './RelatedItemModal';
import useRelationships from '../hooks/Relationships';

const RelatedItems = () => {
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
        location: 'top',
      }}
      className='compact'
      collectionName='relationships'
      columns={[{
        name: 'core_data_connector_names.name',
        label: t('RelatedItems.columns.name'),
        resolve: (resolveAttributeValue.bind(this, 'primary_name.name.name')),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedItemModal,
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

export default RelatedItems;
