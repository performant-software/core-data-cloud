// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RelatedItemModal from './RelatedItemModal';
import useRelationships from '../hooks/Relationships';

const RelatedItems = () => {
  const {
    actions,
    foreignKey,
    loading,
    onDelete,
    onInitialize,
    onLoad,
    onSave,
    projectModelRelationship,
    resolveAttributeValue,
    userDefinedColumns
  } = useRelationships();

  const { t } = useTranslation();

  /**
   * Memo-ize the related items columns.
   */
  const columns = useMemo(() => [{
    name: 'core_data_connector_source_names.name',
    label: t('RelatedItems.columns.name'),
    resolve: resolveAttributeValue.bind(this, 'name'),
    sortable: true
  }, {
    name: 'core_data_connector_items.uuid',
    label: t('Common.columns.uuid'),
    resolve: resolveAttributeValue.bind(this, 'uuid'),
    sortable: true,
    hidden: true
  }, {
    name: 'order',
    label: t('Common.columns.order'),
    sortable: true
  }, ...userDefinedColumns], [resolveAttributeValue, userDefinedColumns]);

  if (loading) {
    return null;
  }

  return (
    <ListTable
      actions={actions}
      addButton={{
        basic: false,
        color: 'grey',
        location: 'top',
      }}
      className='compact'
      collectionName='relationships'
      columns={columns}
      defaultSort='order'
      defaultSortDirection='ascending'
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
      session={{
        key: `related_items_${projectModelRelationship?.id}`,
        storage: localStorage
      }}
    />
  );
};

export default RelatedItems;
