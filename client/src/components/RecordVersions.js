// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import styles from './RecordVersions.module.css';
import UserAvatar from './UserAvatar';

type Props = {
  extraColumns?: any[],
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

  const renderUser = useCallback((version) => {
    return (
      <div className={styles.userCell}>
        <UserAvatar
          name={version.user?.name}
          size={24}
          href={version.user?.avatar_url}
        />
        <span>{version.user?.name}</span>
      </div>
    )
  }, [])

  return (
    <ListTable
      collectionName='versions'
      columns={[...props.extraColumns, {
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
        label: t('Versions.columns.updateType'),
        sortable: true,
        resolve: (version) => version.record_type
      }, {
        name: 'user',
        label: t('Versions.columns.user'),
        render: renderUser
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
