// @flow

import cx from 'classnames';
import React, { useCallback, type ComponentType } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { BiWorld } from 'react-icons/bi';
import { FaFolderOpen, FaUsers } from 'react-icons/fa';
import { GoPeople } from 'react-icons/go';
import { SlOrganization } from 'react-icons/sl';
import { TbDatabaseShare } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import {
  Icon,
  Menu,
  Popup,
  Ref
} from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import MenuLink from './MenuLink';
import PermissionsService from '../services/Permissions';
import styles from './Sidebar.module.css';
import useParams from '../hooks/ParsedParams';

type Props = {
  color?: string,
  context: {
    current: ?HTMLDivElement
  },
  inverted?: boolean
};

const Sidebar: ComponentType<any> = withTranslation()((props: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const params = useParams();
  const { projectId, userId } = params;

  /**
   * Logs the user out and navigates to the index page.
   *
   * @type {function(): Promise<R>|Promise<R|unknown>|Promise<*>|*}
   */
  const onLogout = useCallback(() => AuthenticationService.logout().then(() => navigate('/')), []);

  return (
    <Ref
      innerRef={props.context}
    >
      <Menu
        className={cx(styles.sidebar, styles.ui, styles.vertical, styles.icon, styles.menu)}
        color={props.color}
        fixed='left'
        inverted={props.inverted}
        icon='labeled'
        vertical
      >
        <Menu.Item
          className={cx(styles.item, styles.header)}
          header
        >
          <TbDatabaseShare
            size='2em'
          />
        </Menu.Item>
        <Popup
          content={t('Sidebar.labels.projects')}
          mouseEnterDelay={1000}
          position='right center'
          trigger={(
            <MenuLink
              className={styles.item}
              parent
              to='/projects'
            >
              <FaFolderOpen
                size='2em'
              />
              { projectId && (
                <Menu.Menu>
                  <MenuLink
                    content={t('Sidebar.labels.details')}
                    to={`/projects/${projectId}`}
                  />
                  { PermissionsService.canEditProject(projectId) && (
                    <MenuLink
                      content={t('Sidebar.labels.settings')}
                      parent
                      to={`/projects/${projectId}/project_models`}
                    />
                  )}
                  { PermissionsService.canEditProject(projectId) && (
                    <MenuLink
                      content={t('Sidebar.labels.users')}
                      parent
                      to={`/projects/${projectId}/user_projects`}
                    />
                  )}
                </Menu.Menu>
              )}
            </MenuLink>
          )}
        />
        { PermissionsService.canEditUsers() && (
          <Popup
            content={t('Sidebar.labels.users')}
            mouseEnterDelay={1000}
            position='right center'
            trigger={(
              <MenuLink
                className={styles.item}
                parent
                to='/users'
              >
                <FaUsers
                  size='2em'
                />
                { userId && (
                  <Menu.Menu>
                    <MenuLink
                      content={t('Sidebar.labels.details')}
                      to={`/users/${userId}`}
                    />
                    <MenuLink
                      content={t('Sidebar.labels.projects')}
                      parent
                      to={`/users/${userId}/user_projects`}
                    />
                  </Menu.Menu>
                )}
              </MenuLink>
            )}
          />
        )}
        <Popup
          content={t('Sidebar.labels.places')}
          mouseEnterDelay={1000}
          position='right center'
          trigger={(
            <MenuLink
              className={styles.item}
              parent
              to='/places'
            >
              <BiWorld
                size='2em'
              />
              { params.placeId && (
                <Menu.Menu>
                  <MenuLink
                    content={t('Sidebar.labels.details')}
                    parent
                    to={`/places/${params.placeId}`}
                  />
                </Menu.Menu>
              )}
            </MenuLink>
          )}
        />
        <Popup
          content={t('Sidebar.labels.people')}
          mouseEnterDelay={1000}
          position='right center'
          trigger={(
            <MenuLink
              className={styles.item}
              parent
              to='/people'
            >
              <GoPeople
                size='2em'
              />
              { params.personId && (
                <Menu.Menu>
                  <MenuLink
                    content={t('Sidebar.labels.details')}
                    parent
                    to={`/people/${params.personId}`}
                  />
                </Menu.Menu>
              )}
            </MenuLink>
          )}
        />
        <Popup
          content={t('Sidebar.labels.organizations')}
          mouseEnterDelay={1000}
          position='right center'
          trigger={(
            <MenuLink
              className={styles.item}
              parent
              to='/organizations'
            >
              <SlOrganization
                size='2em'
              />
              { params.organizationId && (
                <Menu.Menu>
                  <MenuLink
                    content={t('Sidebar.labels.details')}
                    parent
                    to={`/organization/${params.organizationId}`}
                  />
                </Menu.Menu>
              )}
            </MenuLink>
          )}
        />
        <Popup
          content={t('Sidebar.labels.logout')}
          mouseEnterDelay={1000}
          position='right center'
          trigger={(
            <Menu.Item
              className={styles.item}
              onClick={onLogout}
            >
              <Icon
                flipped='horizontally'
                name='log out'
                size='big'
              />
            </Menu.Item>
          )}
        />
      </Menu>
    </Ref>
  );
});

export default Sidebar;
