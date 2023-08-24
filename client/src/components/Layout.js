// @flow

import { Breadcrumbs } from '@performant-software/semantic-components';
import React, { useEffect, useMemo, useRef, useState, type AbstractComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import _ from 'underscore';
import BreadcrumbsService, { Services } from '../services/Breadcrumbs';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

const Layout: AbstractComponent<any> = () => {
  const [menuWidth, setMenuWidth] = useState(0);
  const menuRef = useRef();

  const { pathname } = useLocation();
  const params = useParams();

  const { t } = useTranslation();
  const defaultLabel = { new: t('Layout.labels.new') };

  /**
   * Builds the map of URL key to label.
   */
  const labels = useMemo(() => _.reduce(
    _.keys(Services),
    (memo, key) => _.extend(memo, { [key] : t(`Layout.labels.${key}`) }),
    defaultLabel
  ), [defaultLabel, t]);

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
        <Breadcrumbs
          as={Link}
          labels={labels}
          onLoad={(id, name) => BreadcrumbsService.onLoad(name, id, params)}
          pathname={pathname}
        />
        <Outlet />
      </div>
    </Container>
  );
};

export default Layout;
