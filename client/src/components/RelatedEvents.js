// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RelatedEventModal from './RelatedEventModal';
import useRelationships from '../hooks/Relationships';

const RelatedEvents = () => {
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
        name: 'core_data_connector_events.name',
        label: t('RelatedEvents.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'name'),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedEventModal,
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

export default RelatedEvents;
