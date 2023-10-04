// @flow

import React, {
  useEffect,
  useRef,
  useState,
  type AbstractComponent
} from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Ref } from 'semantic-ui-react';
import MenuBar from './MenuBar';
import ProjectSettingsMenu from './ProjectSettingsMenu';
import ProjectItemMenu from './ProjectItemMenu';
import styles from './Layout.module.css';
import UserEditMenu from './UserEditMenu';

const Layout: AbstractComponent<any> = () => {
  const [menuBarHeight, setMenuBarHeight] = useState(0);
  const menuBarRef = useRef();

  /**
   * Sets the menu bar height when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = menuBarRef;

    if (instance) {
      setMenuBarHeight(instance.offsetHeight);
    }
  }, [menuBarRef.current]);

  return (
    <Container
      className={styles.layout}
      fluid
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
      <Container
        className={styles.contentContainer}
        fluid
        style={{
          height: `calc(100vh - ${menuBarHeight}px)`
        }}
      >
        <ProjectItemMenu />
        <ProjectSettingsMenu />
        <UserEditMenu />
        <Outlet />
      </Container>
    </Container>
  );
};

export default Layout;
