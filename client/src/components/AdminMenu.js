// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';
import usePermissions from '../hooks/Permissions';
import useParams from '../hooks/ParsedParams';

const AdminMenu = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const { canCreateJobs, canEditUsers } = usePermissions();

  /**
   * Only render the menu if we're not in a project context and the current user can edit users outside
   * the context of a project.
   */
  if (projectId || !(canEditUsers() || canCreateJobs())) {
    return null;
  }

  return (
    <Menu
      secondary
    >
      <MenuLink
        content={t('AdminMenu.labels.projects')}
        parent
        to='/projects'
      />
      { canEditUsers() && (
        <MenuLink
          content={t('AdminMenu.labels.users')}
          parent
          to='/users'
        />
      )}
      { canCreateJobs() && (
        <MenuLink
          content={t('AdminMenu.labels.jobs')}
          parent
          to='/jobs'
        />
      )}
    </Menu>
  );
};

export default AdminMenu;
