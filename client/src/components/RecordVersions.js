// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  }, []);

  const renderDescription = useCallback((version) => {
    const eventStr = t(`AuditLog.events.${version.event}`);
    const summary = `${eventStr} ${t(`AuditLog.models.${version.record_type}`)}`

    if (version.event !== 'update') {
      return <p className='font-bold'>{summary}</p>;
    }

    const systemFields = Object.keys(version.attributes).map((name) => t(`Common.fields.${name}`));
    const udfs = version.user_defined.map((udf) => udf.label);
    const fields = [...systemFields, ...udfs];

    return (
      <div>
        <p className='font-bold'>{summary}</p>
        <div>
          <p className='uppercase text-xs font-bold'>{t('Common.labels.fields')}</p>
          <p className='text-xs text-gray-600'>{fields.join(', ')}</p>
        </div>
      </div>
    )
  }, [t]);

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
          name: 'description',
          label: t('Versions.columns.description'),
          render: renderDescription
        }]}
        defaultSort='created_at'
        defaultSortDirection='descending'
        onLoad={props.onLoad}
        perPageOptions={[10, 25, 50, 100]}
      />
    </>
  );
};

export default RecordVersions;
