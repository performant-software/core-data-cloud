// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RelatedPersonModal from './RelatedPersonModal';
import useRelationships from '../hooks/Relationships';

const RelatedPeople = () => {
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
   * Memo-ize the related people columns.
   */
  const columns = useMemo(() => [{
    name: 'core_data_connector_person_names.last_name',
    label: t('RelatedPeople.columns.lastName'),
    resolve: resolveAttributeValue.bind(this, 'last_name'),
    sortable: true
  }, {
    name: 'core_data_connector_person_names.first_name',
    label: t('RelatedPeople.columns.firstName'),
    resolve: resolveAttributeValue.bind(this, 'first_name'),
    sortable: true
  }, {
    name: 'core_data_connector_people.uuid',
    label: t('Common.columns.uuid'),
    resolve: resolveAttributeValue.bind(this, 'uuid'),
    sortable: true,
    hidden: true
  }, ...userDefinedColumns], [resolveAttributeValue, userDefinedColumns]);

  if (loading) {
    return null;
  }

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
      columns={columns}
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
      session={{
        key: `related_people_${projectModelRelationship?.id}`,
        storage: localStorage
      }}
    />
  );
};

export default RelatedPeople;
