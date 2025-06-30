// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useMemo } from 'react';
import RelatedTaxonomyItemModal from './RelatedTaxonomyItemModal';
import useRelationships from '../hooks/Relationships';
import { useTranslation } from 'react-i18next';

const RelatedTaxonomyItems = () => {
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
   * Memo-ize the related taxonomy items columns.
   */
  const columns = useMemo(() => [{
    name: 'core_data_connector_taxonomies.name',
    label: t('RelatedTaxonomyItems.columns.name'),
    resolve: resolveAttributeValue.bind(this, 'name'),
    sortable: true
  }, {
    name: 'core_data_connector_taxonomies.uuid',
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
        location: 'top'
      }}
      className='compact'
      collectionName='relationships'
      columns={columns}
      defaultSort='order'
      defaultSortDirection='ascending'
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
      session={{
        key: `related_taxonomies_${projectModelRelationship?.id}`,
        storage: localStorage
      }}
    />
  );
};

export default RelatedTaxonomyItems;
