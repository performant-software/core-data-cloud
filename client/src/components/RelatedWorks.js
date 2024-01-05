// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RelatedWorkModal from './RelatedWorkModal';
import useRelationships from '../hooks/Relationships';

const RelatedWorks = () => {
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
        name: 'edit',
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
        name: 'core_data_connector_names.name',
        label: t('RelatedWorks.columns.name'),
        resolve: resolveAttributeValue.bind(this, 'primary_name.name.name'),
        sortable: true
      }]}
      configurable={false}
      modal={{
        component: RelatedWorkModal,
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

export default RelatedWorks;
