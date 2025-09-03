// @flow

import cx from 'classnames';
import React, { useContext, type Element, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShareFromSquare } from 'react-icons/fa6';
import { Icon, Menu } from 'semantic-ui-react';
import ProjectContext from '../context/Project';
import styles from './ListViewMenu.module.css';
import { useSearchParams } from 'react-router';
import Views from '../constants/ListViews';

type Props = {
  icons?: {
    all?: Element<any>,
    owned?: Element<any>,
    shared?: Element<any>
  },
  onChange: (value: boolean) => void,
  value: boolean
};

const PARAM_VIEW = 'view';

const ListViewMenu = (props: Props) => {
  const { projectModel } = useContext(ProjectContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const { name } = projectModel;

  /**
   * Call the onChange prop with the "view" search parameter when the component is loaded.
   */
  useEffect(() => {
    if (searchParams.get(PARAM_VIEW)) {
      props.onChange(searchParams.get(PARAM_VIEW));
    }
  }, []);

  /**
   * Set the "view" value as a search parameter when the value changes.
   */
  useEffect(() => {
    setSearchParams({ view: props.value });
  }, [props.value]);

  /**
   * Do not render if the current project model has no project_model_shares.
   */
  if (!projectModel.has_shares) {
    return null;
  }

  return (
    <Menu
      className={cx(
        styles.listViewMenu,
        styles.ui,
        styles.compact,
        styles.menu
      )}
      compact
    >
      <Menu.Item
        name={t('ListViewMenu.labels.all', { name })}
        active={Views.all === props.value}
        icon={props.icons?.all}
        onClick={() => props.onChange(Views.all)}
      />
      <Menu.Item
        name={t('ListViewMenu.labels.owned', { name })}
        active={Views.owned === props.value}
        icon={props.icons?.owned}
        onClick={() => props.onChange(Views.owned)}
      />
      <Menu.Item
        name={t('ListViewMenu.labels.shared', { name })}
        active={Views.shared === props.value}
        icon={props.icons?.shared || (
          <Icon>
            <FaShareFromSquare
              size='1rem'
            />
          </Icon>
        )}
        onClick={() => props.onChange(Views.shared)}
      />
    </Menu>
  );
};

export default ListViewMenu;
