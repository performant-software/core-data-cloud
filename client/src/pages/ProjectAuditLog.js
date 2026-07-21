// @flow

import React from 'react';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import RecordVersions from '../components/RecordVersions';
import ProjectsService from '../services/Projects';
import usePermissions from '../hooks/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import { useTranslation } from 'react-i18next';
import { getEditButton } from '../utils/Tables';

const ProjectAuditLog = () => {
  const { projectId } = useParams();
  const { canEditProjectSettings } = usePermissions();
  const { t } = useTranslation();

  if (!canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ProjectSettingsMenu />
      <RecordVersions
        actions={[{
          name: 'edit',
          render: (v) => getEditButton(v, {
            idField: 'item_id',
            resolveUrl: (item) => `/projects/${projectId}/${item.root_project_model_id}/${item.root_id}`
          })
        }]}
        extraColumns={[
          {
            name: 'root_uuid',
            label: t('Versions.columns.uuid')
          },
          {
            name: 'root_record_type',
            label: t('Versions.columns.recordType')
          },
          {
            name: 'root_display_name',
            label: t('Versions.columns.name')
          }
        ]}
        onLoad={(params) => ProjectsService.getVersions(projectId, params)}
      />
    </>
  );
};

export default ProjectAuditLog;
