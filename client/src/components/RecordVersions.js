// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import styles from './RecordVersions.module.css';
import UserAvatar from './UserAvatar';
import RecordVersionModal from './RecordVersionModal';
import type { Version } from '../types/Version';

type Props = {
  actions?: any[],
  columns?: any[],
  onLoad: (params: any) => Promise<any>
};

const RecordVersions = (props: Props) => {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { t } = useTranslation();

  const renderUser = useCallback((version) => {
    return (
      <div className={styles.userCell}>
        <UserAvatar
          name={version.user?.name}
          size={24}
          href={version.user?.avatar_url}
        />
        <span className={styles.userName}>{version.user?.name}</span>
      </div>
    )
  }, [])

  /**
   * Returns a comma-separated summary of the fields changed by the passed version, combining both standard
   * attributes and user-defined fields.
   *
   * @param version
   *
   * @returns {string}
   */
  const resolveFields = useCallback((version) => (
    _.chain(version.attributes)
      .keys()
      .map((name) => t(`Common.fields.${name}`))
      .union(_.pluck(version.user_defined, 'label'))
      .value()
      .join(', ')
  ), []);

  const resolveUpdateType = useCallback((version) => {
    const eventLabel = `${version.event.slice(0, 1).toUpperCase()}${version.event.slice(1)}`

    return [eventLabel, version.record_type].join(' ')
  }, [])

  return (
    <>
      {selectedVersion && (
        <RecordVersionModal
          onClose={() => setSelectedVersion(null)}
          version={selectedVersion}
        />
      )}
      <ListTable
        actions={[
          {
            accept: (item) => item.event === 'update',
            name: 'view',
            icon: 'eye',
            onClick: (item) => setSelectedVersion(item)
          },
          ...(props.actions || [])]}
        collectionName='versions'
        columns={[{
          name: 'user',
          label: t('Versions.columns.user'),
          render: renderUser
        }, {
          name: 'created_at',
          label: t('Versions.columns.date'),
          resolve: (version) => new Date(version.created_at).toLocaleString(),
          sortable: true
        }, ...props.columns || [], {
          name: 'item_type',
          label: t('Versions.columns.updateType'),
          sortable: true,
          resolve: resolveUpdateType
        }, {
          name: 'changes',
          label: t('Versions.columns.fields'),
          resolve: resolveFields
        }]}
        configurable={false}
        defaultSort='created_at'
        defaultSortDirection='descending'
        onLoad={props.onLoad}
        perPageOptions={[10, 25, 50, 100]}
      />
    </>
  );
};

export default RecordVersions;
