// @flow

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type AbstractComponent
} from 'react';
import { Outlet } from 'react-router';
import { Container, Ref } from 'semantic-ui-react';
import _ from 'underscore';
import LayoutContext from '../context/Layout';
import MenuBar from './MenuBar';
import ProjectMenuBar from './ProjectMenuBar';
import styles from './Layout.module.css';

const Layout: AbstractComponent<any> = () => {
  const [contentPadding, setContentPadding] = useState(0);
  const [menuBarHeight, setMenuBarHeight] = useState(0);

  const contentRef = useRef();
  const menuBarRef = useRef();

  /**
   * Memo-izes the context value.
   *
   * @type {{contentPadding: number, menuBarHeight: number}}
   */
  const value = useMemo(() => ({ contentPadding, menuBarHeight }), [contentPadding, menuBarHeight]);

  /**
   * Sets the menu bar height when the component is mounted.
   */
  useEffect(() => {
    const { current: instance } = menuBarRef;

    const observer = new ResizeObserver(() => {
      if (instance) {
        setMenuBarHeight(instance.offsetHeight);
      }
    });

    if (instance) {
      observer.observe(instance);
    }

    return () => observer.disconnect();
  }, []);

  /**
   * Sets the content padding when the component is loaded.
   */
  useEffect(() => {
    const { current: instance } = contentRef;

    const observer = new ResizeObserver(() => {
      if (instance) {
        const computedStyle = window.getComputedStyle(instance);
        const paddingTop = computedStyle.getPropertyValue('padding-top');
        const paddingBottom = computedStyle.getPropertyValue('padding-bottom');

        const top = parseInt(paddingTop, 10);
        const bottom = parseInt(paddingBottom, 10);

        if (!_.isNaN(top) && !_.isNaN(bottom)) {
          setContentPadding(top + bottom);
        }
      }
    });

    if (instance) {
      observer.observe(instance);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Container
      className={styles.layout}
      fluid
    >
      <Ref
        innerRef={menuBarRef}
      >
        <Container
          fluid
        >
          <MenuBar />
          <ProjectMenuBar />
        </Container>
      </Ref>
      <Ref
        innerRef={contentRef}
      >
        <LayoutContext.Provider
          value={value}
        >
          <Container
            className={styles.contentContainer}
            fluid
          >
            <Outlet />
          </Container>
        </LayoutContext.Provider>
      </Ref>
    </Container>
  );
};

export default Layout;
