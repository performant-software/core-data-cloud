// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import MenuLink from './MenuLink';
import useParams from '../hooks/ParsedParams';

const UserEditMenu = () => {
  const { userId } = useParams();
  const { t } = useTranslation();

  if (!userId) {
    return null;
  }

  return (
    <Menu
      secondary
    >
      <MenuLink
        content={t('UserEditMenu.labels.details')}
        to={`/users/${userId}`}
      />
      <MenuLink
        content={t('UserEditMenu.labels.projects')}
        to={`/users/${userId}/user_projects`}
      />
    </Menu>
  );
};

export default UserEditMenu;
