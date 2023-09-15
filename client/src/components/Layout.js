// @flow

import React, {
  useEffect,
  useRef,
  useState,
  type AbstractComponent
} from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import ProjectSidebar from './ProjectSidebar';

const Layout: AbstractComponent<any> = () => {
  const [rootMenuWidth, setRootMenuWidth] = useState(0);
  const [projectMenuWidth, setProjectMenuWidth] = useState(0);

  const rootMenuRef = useRef();
  const projectMenuRef = useRef();
  const params = useParams();

  /**
   * Sets the root sidebar menu width when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = rootMenuRef;

    if (instance) {
      setRootMenuWidth(instance.offsetWidth);
    } else {
      setRootMenuWidth(0);
    }
  }, [rootMenuRef.current]);

  /**
   * Sets the project sidebar menu width when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = projectMenuRef;

    if (instance) {
      setProjectMenuWidth(instance.offsetWidth);
    } else {
      setProjectMenuWidth(0);
    }
  }, [projectMenuRef.current, params.projectId]);

  return (
    <Container
      className={styles.layout}
      fluid
    >
      <Sidebar
        context={rootMenuRef}
      />
      { params.projectId && (
        <ProjectSidebar
          context={projectMenuRef}
          offset={rootMenuWidth}
          visible={!!params.projectId}
        />
      )}
      <div
        className={styles.content}
        style={{
          marginLeft: `${rootMenuWidth + projectMenuWidth}px`
        }}
      >
        <Outlet />
      </div>
    </Container>
  );
};

export default Layout;
