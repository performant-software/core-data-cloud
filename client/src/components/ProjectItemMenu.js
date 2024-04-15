// @flow

import cx from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import _ from 'underscore';
import ProjectContext from '../context/Project';
import ScrollableContext from '../context/Scrollable';
import styles from './ProjectItemMenu.module.css';
import useParams from '../hooks/ParsedParams';

const SECTION_ID_DETAILS = 'details';
const SECTION_ID_IDENTIFIERS = 'identifiers';

const ProjectItemMenu = () => {
  const [activeSection, setActiveSection] = useState();

  const { projectModel } = useContext(ProjectContext);
  const { sections, scrollContext } = useContext(ScrollableContext);

  const { itemId } = useParams();
  const { t } = useTranslation();

  /**
   * Scrolls the clicked section into view.
   *
   * @type {(function(*): void)|*}
   */
  const onSectionClick = useCallback((id) => {
    const section = _.findWhere(sections.current, { id: id?.toString() });

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sections]);

  /**
   * Adds the passed section to the list of items.
   *
   * @type {(function(*, *, *): void)|*}
   */
  const addSection = useCallback((items, id, name) => {
    items.push({
      active: activeSection && activeSection === id?.toString(),
      content: name,
      onClick: () => onSectionClick(id)
    });
  }, [activeSection, onSectionClick]);

  /**
   * Builds the list of menu items based on the relationships for the current project model.
   *
   * @type {[]}
   */
  const menuItems = useMemo(() => {
    const items = [];

    // Add the details sections
    addSection(items, SECTION_ID_DETAILS, t('ProjectItemMenu.labels.details'));

    // Relationships are only available if the record has been saved
    if (itemId) {
      _.each(projectModel?.all_project_model_relationships, (projectModelRelationship) => {
        const name = projectModelRelationship.inverse
          ? projectModelRelationship.inverse_name
          : projectModelRelationship.name;

        addSection(items, projectModelRelationship.id, name);
      });

      // Add web identifiers
      if (projectModel?.allow_identifiers) {
        addSection(items, SECTION_ID_IDENTIFIERS, t('ProjectItemMenu.labels.identifiers'));
      }
    }

    return items;
  }, [addSection, itemId, projectModel]);

  /**
   * Determines the active section on container scroll.
   */
  const onScroll = useCallback(() => {
    const instance = scrollContext?.current;

    if (instance) {
      let active;

      const { scrollTop, offsetTop: scrollOffset } = instance;

      _.each(sections.current, (section) => {
        const { offsetTop } = section;

        if (scrollTop >= offsetTop - scrollOffset) {
          active = section.getAttribute('id');
        }
      });

      setActiveSection(active);
    }
  }, [sections, scrollContext]);

  /**
   * Adds the scroll listener to the window object.
   */
  useEffect(() => {
    const instance = scrollContext?.current;

    // Add the scroll listener
    if (instance) {
      instance.addEventListener('scroll', onScroll);
    }

    // Initial call
    onScroll();

    // Cleanup
    return () => {
      if (instance) {
        instance.removeEventListener('scroll', onScroll);
      }
    };
  }, [onScroll]);

  return (
    <Menu
      className={cx(
        styles.projectItemMenu,
        styles.ui,
        styles.menu,
        styles.pointing,
        styles.secondary,
        styles.vertical
      )}
      pointing
      secondary
      vertical
      items={menuItems}
    />
  );
};

export default ProjectItemMenu;
