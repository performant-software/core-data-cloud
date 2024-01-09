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
        color: 'dark gray',
        location: 'top'
      }}
      className='compact'
      collectionName='relationships'
      columns={[{
        name: 'core_data_connector_place_names.name',
        label: t('RelatedPlaces.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'name'),
        sortable: true
      }]}
      configurable={false}
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
    />
  );
};

export default RelatedPlaces;
