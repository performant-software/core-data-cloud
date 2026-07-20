// @flow

import { ListTable } from '@performant-software/semantic-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';

type Props = {
  onLoad: (params: any) => Promise<any>
};

/**
 * Returns a comma-separated summary of the fields changed by the passed version, combining both standard
 * attributes and user-defined fields.
 *
 * @param version
 *
 * @returns {string}
 */
const resolveChanges = (version) => (
  _.chain(version.attributes)
    .keys()
    .union(_.pluck(version.user_defined, 'label'))
    .value()
    .join(', ')
);

const RecordVersions = (props: Props) => {
  const { t } = useTranslation();

  return (
    <ListTable
      className='compact'
      collectionName='versions'
      columns={[{
        name: 'created_at',
        label: t('Versions.columns.date'),
        resolve: (version) => new Date(version.created_at).toLocaleString(),
        sortable: true
      }, {
        name: 'event',
        label: t('Common.columns.name'),
        sortable: true
      }, {
        name: 'item_type',
        label: t('Versions.columns.recordType'),
        resolve: (version) => version.record_type,
        sortable: true
      }, {
        name: 'user',
        label: t('Versions.columns.user'),
        resolve: (version) => version.user?.name
      }, {
        name: 'changes',
        label: t('Versions.columns.changes'),
        resolve: resolveChanges
      }]}
      configurable={false}
      defaultSort='created_at'
      defaultSortDirection='descending'
      onLoad={props.onLoad}
    />
  );
};

export default RecordVersions;
