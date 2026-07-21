// @flow

import React from 'react';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import RecordVersions from '../components/RecordVersions';
import ProjectsService from '../services/Projects';
import usePermissions from '../hooks/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import { useTranslation } from 'react-i18next';

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
