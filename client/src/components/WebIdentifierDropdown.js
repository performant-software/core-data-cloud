// @flow

import cx from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown,
  DropdownSearchInput,
  Icon,
  Ref
} from 'semantic-ui-react';
import _ from 'underscore';
import styles from './WebIdentifierDropdown.module.css';
import WebAuthoritiesService from '../services/WebAuthorities';

type Props = {
  id?: string,
  authorityId: number,
  onChange: (identifier: number | string) => void,
  onSearch: (data: any) => Array<any>,
  renderOption: (item: any) => ComponentType,
  resolveLabel: (item: any) => string,
  value: ?number | ?string
};

const SEARCH_TIMEOUT = 500;

const WebIdentifierDropdown = (props: Props) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef();
  const { t } = useTranslation();

  /**
   * Returns true if the passed item is active.
   *
   * @type {function(*): boolean}
   */
  const isActive = useCallback((item) => item.id === props.value, [props.value]);

  /**
   * Returns the style class for the passed item.
   *
   * @type {function(*): string}
   */
  const getItemClass = useCallback((item) => {
    const classNames = [styles.item];

    if (isActive(item)) {
      classNames.push(styles.active);
    }

    return cx(classNames);
  }, [isActive]);

  /**
   * Populates the passed results with an "id" attribute if the prop is present.
   *
   * @type {(function(*): (*))|*}
   */
  const transformResults = useCallback((results) => {
    if (props.id) {
      return _.map(results, (result) => ({ ...result, id: result[props.id] }));
    }

    return results;
  }, [props.id]);

  /**
   * Resets the search query and closes the menu.
   *
   * @type {(function(): void)|*}
   */
  const onBlur = useCallback(() => {
    if (!props.value) {
      setSearchQuery('');
    }

    setOpen(false);
  }, [props.value]);

  /**
   * Calls the onChange prop with no value, indicating the value has been removed.
   *
   * @type {function(): *}
   */
  const onClear = useCallback(() => props.onChange(), [props.onChange]);

  /**
   * Calls the /web_authorities/:id/search API endpoint and sets the results on the state.
   *
   * @type {(function(): void)|*}
   */
  const onSearch = useCallback(() => {
    if (searchQuery) {
      setLoading(true);

      WebAuthoritiesService
        .search(props.authorityId, searchQuery)
        .then(({ data }) => props.onSearch(data))
        .then(transformResults)
        .then((results) => setItems(results))
        .finally(() => setLoading(false));
    }
  }, [searchQuery, transformResults, props.authorityId, props.onSearch]);

  /**
   * If the value prop is passed, query for the entity and set the label on the state. Otherwise, clear the
   * search query and items from the state.
   */
  useEffect(() => {
    if (props.value) {
      WebAuthoritiesService
        .find(props.authorityId, props.value)
        .then(({ data }) => {
          const label = props.resolveLabel(data);
          setSearchQuery(label);
        });
    } else {
      // Clear the search query and items from the state.
      setSearchQuery('');
      setItems([]);

      // Focus on the search input
      inputRef?.current?.focus();
    }
  }, [props.value]);

  /**
   * Calls the onSearch function after the user has stopped typing.
   */
  useEffect(() => {
    const timeoutId = setTimeout(onSearch, SEARCH_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Dropdown
      className={cx(styles.webIdentifierDropdown, styles.ui, styles.dropdown)}
      clearable
      fluid
      lazyLoad
      loading={loading}
      onBlur={onBlur}
      onChange={onClear}
      onClick={() => setOpen((prevOpen) => !prevOpen)}
      onFocus={() => setOpen(true)}
      onSearchChange={(e, data) => setSearchQuery(data.searchQuery)}
      open={open}
      placeholder={t('WebIdentifierDropdown.labels.search')}
      selection
      search
      searchInput={(
        <Ref
          innerRef={inputRef}
        >
          <DropdownSearchInput
            value={searchQuery}
          />
        </Ref>
      )}
      searchQuery={searchQuery}
      text={searchQuery}
      value={props.value}
    >
      <Dropdown.Menu
        className={styles.menu}
      >
        { _.map(items, (item) => (
          <Dropdown.Item
            active={props.value === item.id}
            className={getItemClass(item)}
            key={item.id}
            onClick={() => props.onChange(item.id)}
            value={item.id}
          >
            <div
              className={styles.optionContainer}
            >
              { props.renderOption(item) }
            </div>
            <div>
              { isActive(item) && (
                <Icon
                  color='green'
                  name='checkmark'
                />
              )}
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default WebIdentifierDropdown;
