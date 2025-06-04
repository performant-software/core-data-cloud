// @flow

import React from 'react';
import ProjectSettingsMenu from '../components/ProjectSettingsMenu';
import { ListTable } from '@performant-software/semantic-components';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PermissionsService from '../services/Permissions';
import useParams from '../hooks/ParsedParams';
import WebAuthoritiesService from '../services/WebAuthorities';
import WebAuthorityUtils from '../utils/WebAuthorities';

const WebAuthorities = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Return to the projects list if the user does not have permissions to edit this project.
   */
  if (!PermissionsService.canEditProjectSettings(projectId)) {
    return (
      <Navigate
        replace
        to='/projects'
      />
    );
  }

  return (
    <>
      <ProjectSettingsMenu />
      <ListTable
        actions={[{
          name: 'edit',
          icon: 'pencil',
          onClick: (authority) => navigate(`${authority.id}`)
        }, {
          name: 'delete',
          icon: 'times'
        }]}
        addButton={{
          basic: false,
          color: 'blue',
          location: 'top',
          onClick: () => navigate('new')
        }}
        collectionName='web_authorities'
        columns={[{
          name: 'source_type',
          label: t('WebAuthorities.columns.sourceType'),
          resolve: (authority) => WebAuthorityUtils.getSourceView(authority),
          sortable: true
        }]}
        onDelete={(authority) => WebAuthoritiesService.delete(authority)}
        onLoad={(params) => WebAuthoritiesService.fetchAll({ ...params, project_id: projectId })}
        searchable
        session={{
          key: `web_authorities_${projectId}`,
          storage: localStorage
        }}
      />
    </>
  );
};

export default WebAuthorities;
