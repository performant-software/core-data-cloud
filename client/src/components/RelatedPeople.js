// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RelatedPersonModal from './RelatedPersonModal';
import useRelationships from '../hooks/Relationships';

const RelatedPeople = () => {
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
        name: 'core_data_connector_person_names.last_name',
        label: t('RelatedPeople.columns.lastName'),
        resolve: resolveAttributeValue.bind(this, 'last_name'),
        sortable: true
      }, {
        name: 'core_data_connector_person_names.first_name',
        label: t('RelatedPeople.columns.firstName'),
        resolve: resolveAttributeValue.bind(this, 'first_name'),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedPersonModal,
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

export default RelatedPeople;
