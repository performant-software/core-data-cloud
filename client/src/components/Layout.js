// @flow

import { Breadcrumbs } from '@performant-software/semantic-components';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AbstractComponent
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Outlet,
  useLocation,
  useParams
} from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'underscore';
import BreadcrumbsService, { Services } from '../services/Breadcrumbs';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import UserLabel from './UserLabel';

const Layout: AbstractComponent<any> = () => {
  const [menuWidth, setMenuWidth] = useState(0);
  const menuRef = useRef();

  const { pathname } = useLocation();
  const params = useParams();

  const { t } = useTranslation();
  const defaultLabel = { new: t('Layout.labels.new') };

  /**
   * Resolves the label for nested join tables.
   *
   * @type {function(*, string): *}
   */
  const resolveLabel = useCallback((memo: any, key: string) => {
    let label = t(`Layout.labels.${key}`);

    if (key === Services.user_projects) {
      label = params.projectId
        ? t(`Layout.labels.${Services.users}`)
        : t(`Layout.labels.${Services.projects}`);
    }

    return _.extend(memo, { [key]: label });
  }, [params]);

  /**
   * Builds the map of URL key to label.
   */
  const labels = useMemo(() => _.reduce(_.keys(Services), resolveLabel, defaultLabel), [defaultLabel, t]);

  /**
   * Sets the sidebar menu width when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = menuRef;

    if (instance) {
      setMenuWidth(instance.offsetWidth);
    }
  }, [menuRef.current]);

  return (
    <Container
      className={styles.layout}
      fluid
    >
      <Sidebar
        context={menuRef}
      />
      <div
        className={styles.content}
        style={{
          marginLeft: `${menuWidth}px`
        }}
      >
        <Grid
          columns={2}
        >
          <Grid.Column>
            <Breadcrumbs
              as={Link}
              labels={labels}
              onLoad={(id, name) => BreadcrumbsService.onLoad(name, id, params)}
              pathname={pathname}
            />
          </Grid.Column>
          <Grid.Column
            textAlign='right'
          >
            <UserLabel />
          </Grid.Column>
        </Grid>
        <Outlet />
      </div>
    </Container>
  );
};

export default Layout;
