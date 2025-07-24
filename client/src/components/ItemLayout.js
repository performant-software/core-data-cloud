// @flow

import { Element } from '@performant-software/shared-components';
import { Toaster } from '@performant-software/semantic-components';
import cx from 'classnames';
import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Node, useCallback
} from 'react';
import { Container } from 'semantic-ui-react';
import _ from 'underscore';
import LayoutContext from '../context/Layout';
import ScrollableContext from '../context/Scrollable';
import styles from './ItemLayout.module.css';

type Props = {
  className?: string,
  children: Node
};

const ItemLayout = (props: Props) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollContext, setScrollContext] = useState();

  const { contentPadding, menuBarHeight } = useContext(LayoutContext);

  const headerRef = useRef();
  const contentRef = useRef();
  const sections = useRef([]);

  const content = useMemo(() => _.first(Element.findByType(props.children, ItemLayout.Content)), [props.children]);
  const header = useMemo(() => _.first(Element.findByType(props.children, ItemLayout.Header)), [props.children]);
  const sidebar = useMemo(() => _.first(Element.findByType(props.children, ItemLayout.Sidebar)), [props.children]);
  const toasters = useMemo(() => Element.findByType(props.children, ItemLayout.Toaster), [props.children]);

  /**
   * Sets the classname value for the root element.
   *
   * @type {string}
   */
  const className = useMemo(() => {
    const value = [styles.itemLayout, styles.ui, styles.container];

    if (props.className) {
      value.push(props.className);
    }

    return cx(value);
  }, [props.className]);

  /**
   * Sets the content container class names.
   *
   * @type {[*]}
   */
  const contentClassName = useMemo(() => {
    const classNames = [styles.content];

    if (sidebar) {
      classNames.push(styles.padded);
    }

    return classNames;
  }, [sidebar]);

  /**
   * Sets the content style attribute.
   *
   * @type {{height: string}}
   */
  const contentStyle = useMemo(() => {
    const style = {
      height: `calc(100vh - ${contentPadding + menuBarHeight + headerHeight}px)`
    };

    if (sidebar) {
      style.overflow = 'auto';
    }

    return style;
  }, [contentPadding, menuBarHeight, headerHeight, sidebar]);

  /**
   * Stores the element ref in the <code>sections</code> ref.
   */
  const setSectionRef = useCallback((e: HTMLElement | null) => e && sections.current.push(e), [sections]);

  /**
   * Sets the content style attribute.
   *
   * @type {{height: string}}
   */
  const sidebarStyle = useMemo(() => ({
    height: `calc(100vh - ${contentPadding + menuBarHeight + headerHeight}px)`,
    minWidth: 'min-content',
    overflow: 'auto'
  }), [contentPadding, menuBarHeight, headerHeight]);

  /**
   * Memo-izes the value to set on the context.
   *
   * @type {{
   *  setScrollContext: function(): void,
   *  setSectionRef: function((HTMLElement|null)): *,
   *  scrollContext: unknown,
   *  sections: {current: (*[]|null)}
   * }}
   */
  const value = useMemo(() => ({
    scrollContext,
    sections,
    setScrollContext,
    setSectionRef
  }), [scrollContext, sections, setScrollContext, setSectionRef]);

  /**
   * Memo-izes the list of visible toasters.
   */
  const visibleToasters = useMemo(() => _.filter(toasters, (toaster) => toaster.props.visible), [toasters]);

  /**
   * Sets the observer on the header container to reset the height.
   */
  useEffect(() => {
    const { current: instance } = headerRef;

    const observer = new ResizeObserver(() => {
      if (instance) {
        setHeaderHeight(instance.offsetHeight);
      }
    });

    if (instance) {
      observer.observe(instance);
    }

    return () => observer.disconnect(); // clean up
  }, [headerRef]);

  /**
   * Sets the scroll context on the layout.
   */
  useEffect(() => setScrollContext(contentRef), []);

  return (
    <ScrollableContext.Provider
      value={value}
    >
      <Container
        className={className}
        fluid
      >
        { _.map(visibleToasters, (toaster, index) => (
          <Toaster
            key={index}
            onDismiss={toaster.props.onDismiss}
            timeout={toaster.props.timeout}
            type={toaster.props.type}
          >
            { toaster.props.children }
          </Toaster>
        ))}
        { header && (
          <div
            ref={headerRef}
          >
            { header.props.children }
          </div>
        )}
        <div
          className={styles.mainContainer}
        >
          { sidebar && (
            <div
              className={styles.sidebar}
              style={sidebarStyle}
            >
              { sidebar.props.children }
            </div>
          )}
          { content && (
            <div
              className={cx(contentClassName)}
              ref={contentRef}
              style={contentStyle}
            >
              { content.props.children }
            </div>
          )}
        </div>
      </Container>
    </ScrollableContext.Provider>
  );
};

const Content = (props) => props.children;
Content.displayName = 'Content';
ItemLayout.Content = Content;

const Header = (props) => props.children;
Header.displayName = 'Header';
ItemLayout.Header = Header;

const Sidebar = (props) => props.children;
Sidebar.displayName = 'Sidebar';
ItemLayout.Sidebar = Sidebar;

const ToasterComponent = (props) => props.children;
Toaster.displayName = 'Toaster';
ItemLayout.Toaster = ToasterComponent;

export default ItemLayout;
