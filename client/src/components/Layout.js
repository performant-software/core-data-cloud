// @flow

import React, {
  useEffect,
  useRef,
  useState,
  type AbstractComponent
} from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { Container, Icon, Menu, Ref } from 'semantic-ui-react';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';
import ProjectSidebar from './ProjectSidebar';
import MenuBar from './MenuBar';
import MenuLink from './MenuLink';

const Layout: AbstractComponent<any> = () => {
  const [menuBarHeight, setMenuBarHeight] = useState(0);
  const [sideBarWidth, setSideBarWidth] = useState(0);

  const menuBarRef = useRef();
  const params = useParams();
  const sideBarRef = useRef();

  /**
   * Sets the root sidebar menu width when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = menuBarRef;

    if (instance) {
      setMenuBarHeight(instance.offsetHeight);
    }
  }, [menuBarRef.current]);

  useEffect(() => {
    const { current: instance } = sideBarRef;

    if (instance) {
      setSideBarWidth(instance.offsetWidth);
    }
  }, [sideBarRef.current]);

  return (
    <Container
      className={styles.layout}
      fluid
      style={{
        marginLeft: `calc(100vw - ${sideBarWidth}px !important`
      }}
    >
      <Ref
        innerRef={menuBarRef}
      >
        <Container
          className={styles.menuBarContainer}
          fluid
        >
          <MenuBar />
        </Container>
      </Ref>
      <ProjectSidebar
        context={sideBarRef}
      />
      <Container
        className={styles.contentContainer}
        fluid
        style={{
          height: `calc(100vh - ${menuBarHeight}px)`
        }}
      >
        { params.projectId && (
          <Menu
            secondary
          >
            <MenuLink
              to='/projects'
            >
              <Icon
                name='arrow left'
              />
              All Projects
            </MenuLink>
            <MenuLink
              content={'Details'}
              to={`/projects/${params.projectId}`}
            />
            <MenuLink
              content={'Configure'}
              parent
              to={`/projects/${params.projectId}/project_models`}
            />
            <MenuLink
              content={'Users'}
              parent
              to={`/projects/${params.projectId}/user_projects`}
            />
          </Menu>
        )}
        <Outlet />
      </Container>
    </Container>
  );
};

export default Layout;
