// @flow

import React, { useCallback } from 'react';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import RecordVersions from '../components/RecordVersions';
import ProjectsService from '../services/Projects';
import usePermissions from '../hooks/Permissions';
import UnauthorizedRedirect from '../components/UnauthorizedRedirect';
import useParams from '../hooks/ParsedParams';
import { useTranslation } from 'react-i18next';
import { getEditButton } from '../utils/Tables';

const EDITABLE_EVENTS = ['update', 'create'];

const ProjectAuditLog = () => {
  const { projectId } = useParams();
  const { canEditProjectSettings } = usePermissions();
  const { t } = useTranslation();

  const renderRootField = useCallback((version, fieldName) => {
    return version.roots.map(r => (
      <p key={r.uuid}>{r[fieldName]}</p>
    ));
  }, [])

  const resolveEditUrl = useCallback((version) => {
    return `/projects/${projectId}/${version.roots[0].project_model_id}/${version.roots[0].id}`
  }, [])

  if (!canEditProjectSettings(projectId)) {
    return <UnauthorizedRedirect />;
  }

  return (
    <>
      <ProjectSettingsMenu />
      <RecordVersions
        actions={[{
          // prevent the user from being directed to the edit page for destroyed records
          accept: (v) => EDITABLE_EVENTS.includes(v.event),
          name: 'edit',
          render: (v) => getEditButton(v, {
            idField: 'item_id',
            resolveUrl: resolveEditUrl
          })
        }]}
        columns={[
          {
            name: 'root_uuid',
            label: t('Versions.columns.uuid'),
            render: (v) => renderRootField(v, 'uuid'),
            hidden: true
          },
          {
            name: 'root_record_type',
            label: t('Versions.columns.type'),
            render: (v) => renderRootField(v, 'record_type')
          },
          {
            name: 'root_display_name',
            label: t('Versions.columns.name'),
            render: (v) => renderRootField(v, 'display_name')
          }
        ]}
        onLoad={(params) => ProjectsService.getVersions(projectId, params)}
      />
    </>
  );
};

export default ProjectAuditLog;
