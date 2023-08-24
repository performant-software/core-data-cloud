// @flow

import cx from 'classnames';
import React, { useCallback, type ComponentType } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { FaFolderOpen, FaUsers } from 'react-icons/fa';
import { TbDatabaseShare } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, Menu, Popup, Ref } from 'semantic-ui-react';
import AuthenticationService from '../services/Authentication';
import MenuLink from './MenuLink';
import styles from './Sidebar.module.css';

type Props = {
  color?: string,
  context: {
    current: ?HTMLDivElement
  },
  inverted?: boolean
};

const Sidebar: ComponentType<any> = withTranslation()((props: Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation();

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
              { params.projectId && (
                <Menu.Menu>
                  <MenuLink
                    content={'Details'}
                    to={`/projects/${params.projectId}`}
                  />
                </Menu.Menu>
              )}
            </MenuLink>
          )}
        />
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
              { params.userId && (
                <Menu.Menu>
                  <MenuLink
                    content={'Details'}
                    to={`/users/${params.userId}`}
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
