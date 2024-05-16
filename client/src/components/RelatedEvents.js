// @flow

import { ListTable } from '@performant-software/semantic-components';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RelatedEventModal from './RelatedEventModal';
import useRelationships from '../hooks/Relationships';

const RelatedEvents = () => {
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
   * Resolves the fuzzy date value for the passed attribute.
   *
   * @type {function(*, *): *}
   */
  const resolveDate = useCallback((attribute, relationship) => {
    const date = resolveAttributeValue(attribute, relationship);
    return FuzzyDateUtils.getDateView(date);
  }, []);

  /**
   * Memo-ize the related events columns.
   */
  const columns = useMemo(() => [{
    name: 'core_data_connector_events.name',
    label: t('RelatedEvents.columns.name'),
    resolve: resolveAttributeValue.bind(this, 'name'),
    sortable: true
  }, {
    name: 'start_date.start_date',
    label: t('RelatedEvents.columns.startDate'),
    resolve: resolveDate.bind(this, 'start_date'),
    sortable: true
  }, {
    name: 'end_date.start_date',
    label: t('RelatedEvents.columns.endDate'),
    resolve: resolveDate.bind(this, 'end_date'),
    sortable: true
  }, {
    name: 'core_data_connector_events.uuid',
    label: t('Common.columns.uuid'),
    resolve: resolveAttributeValue.bind(this, 'uuid'),
    sortable: true,
    hidden: true
  }, ...userDefinedColumns], [resolveAttributeValue, resolveDate, userDefinedColumns]);

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
        component: RelatedEventModal,
        props: {
          onInitialize,
          required: [foreignKey]
        }
      }}
      onDelete={onDelete}
      onLoad={onLoad}
      onSave={onSave}
      session={{
        key: `related_event_${projectModelRelationship?.id}`,
        storage: localStorage
      }}
    />
  );
};

export default RelatedEvents;
