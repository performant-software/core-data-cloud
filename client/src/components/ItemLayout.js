// @flow

import { Element } from '@performant-software/shared-components';
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
  const contentStyle = useMemo(() => ({
    height: `calc(100vh - ${contentPadding + menuBarHeight + headerHeight}px)`
  }), [contentPadding, menuBarHeight, headerHeight]);

  /**
   * Stores the element ref in the <code>sections</code> ref.
   */
  const setSectionRef = useCallback((e: HTMLElement | null) => e && sections.current.push(e), [sections]);

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
        className={cx(styles.itemLayout, styles.ui, styles.container)}
        fluid
      >
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
ItemLayout.Content = Content;

const Header = (props) => props.children;
ItemLayout.Header = Header;

const Sidebar = (props) => props.children;
ItemLayout.Sidebar = Sidebar;

export default ItemLayout;
