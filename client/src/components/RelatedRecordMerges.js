// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectContext from '../context/Project';
import RecordMergesService from '../services/RecordMerges';
import useParams from '../hooks/ParsedParams';

const RelatedRecordMerges = () => {
  const { projectModel } = useContext(ProjectContext);
  const { itemId } = useParams();
  const { t } = useTranslation();

  /**
   * Deletes the passed record merge.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onDelete = useCallback((recordMerge) => RecordMergesService.delete(recordMerge), []);

  /**
   * Loads the list of related record merges.
   *
   * @type {function(*): Promise<AxiosResponse<T>>}
   */
  const onLoad = useCallback((params) => (
    RecordMergesService
      .fetchAll({
        ...params,
        mergeable_id: itemId,
        mergeable_type: projectModel?.model_class
      })
  ), [itemId, projectModel]);

  return (
    <ListTable
      actions={[{
        name: 'delete',
        icon: 'times'
      }]}
      className='compact'
      collectionName='record_merges'
      columns={[{
        name: 'merged_uuid',
        label: t('Common.columns.uuid'),
        sortable: true
      }, {
        name: 'created_at',
        label: t('RelatedRecordMerges.columns.created'),
        resolve: (recordMerge) => new Date(recordMerge.created_at).toLocaleDateString(),
        sortable: true
      }]}
      configurable={false}
      onDelete={onDelete}
      onLoad={onLoad}
    />
  );
};

export default RelatedRecordMerges;
