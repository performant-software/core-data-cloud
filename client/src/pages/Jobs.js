// @flow

import { ListTable } from '@performant-software/semantic-components';
import React, { type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import DateTimeUtils from '../utils/DateTime';
import { getTypeView } from '../utils/JobTypes';
import JobsService from '../services/Jobs';
import JobStatus from '../components/JobStatus';
import PermissionsService from '../services/Permissions';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';

const Users: AbstractComponent<any> = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();

  if (!PermissionsService.canCreateJobs()) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      { projectId && (
        <ProjectSettingsMenu />
      )}
      <ListTable
        actions={[{
          as: Link,
          asProps: (job) => ({
            download: true,
            to: job.download_url
          }),
          name: 'download',
          icon: 'cloud download',
          popup: {
            content: t('Jobs.actions.download.content'),
            title: t('Jobs.actions.download.title')
          }
        },{
          name: 'delete'
        }]}
        addButton={{}}
        collectionName='jobs'
        columns={[{
          name: 'created_at',
          label: t('Jobs.columns.timestamp'),
          resolve: (job) => DateTimeUtils.getTimestamp(job.created_at),
          sortable: true
        }, {
          name: 'core_data_connector_projects.name',
          label: t('Jobs.columns.project'),
          resolve: (job) => job.project.name,
          sortable: true,
          hidden: !!projectId
        }, {
          name: 'job_type',
          label: t('Jobs.columns.type'),
          resolve: (job) => getTypeView(job.job_type),
          sortable: true
        }, {
          name: 'status',
          label: t('Jobs.columns.status'),
          render: (job) => (
            <JobStatus
              status={job.status}
            />
          ),
          sortable: true
        }, {
          name: 'core_data_connector_users.name',
          label: t('Jobs.columns.user'),
          resolve: (job) => job.user.name,
          sortable: true
        }]}
        defaultSort='created_at'
        defaultSortDirection='descending'
        onDelete={(job) => JobsService.delete(job)}
        onLoad={(params) => JobsService.fetchAll({ ...params, project_id: projectId })}
        searchable
        session={{
          key: 'jobs',
          storage: localStorage
        }}
      />
    </>
  );
};

export default Users;
