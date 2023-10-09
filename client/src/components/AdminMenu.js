// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import useParams from '../hooks/ParsedParams';

const AdminMenu = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Only render the menu if we're not in a project context and the current user can edit users outside
   * the context of a project.
   */
  if (projectId || !PermissionsService.canEditUsers()) {
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
      <MenuLink
        content={t('AdminMenu.labels.users')}
        parent
        to='/users'
      />
    </Menu>
  );
};

export default AdminMenu;
