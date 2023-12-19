// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RelatedPlaceModal from './RelatedPlaceModal';
import useRelationships from '../hooks/Relationships';

const RelatedPlaces = () => {
  const {
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
      actions={[{
        name: 'edit'
      }, {
        name: 'delete'
      }]}
      addButton={{
        basic: false,
        color: 'blue',
        location: 'top'
      }}
      collectionName='relationships'
      columns={[{
        name: 'core_data_connector_place_names.name',
        label: t('RelatedPlaces.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'name'),
        sortable: true
      }]}
      modal={{
        component: RelatedPlaceModal,
        props: {
          onInitialize,
          required: [foreignKey]
        }
      }}
      onDelete={onDelete}
      onLoad={onLoad}
      onSave={onSave}
      searchable
    />
  );
};

export default RelatedPlaces;
