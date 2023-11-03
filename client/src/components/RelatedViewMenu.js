// @flow

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Dropdown, Form } from 'semantic-ui-react';
import _ from 'underscore';
import styles from './RelatedViewMenu.css';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import Views from '../constants/ListViews';

type Props = {
  onChange: (value: string) => void,
  value: string
};

const RelatedViewMenu = (props: Props) => {
  const { projectModelRelationship } = useProjectModelRelationship();
  const { t } = useTranslation();

  /**
   * Sets the name of the related record based on the relationship inverse property.
   *
   * @type {string}
   */
  const name = useMemo(() => (
    projectModelRelationship.inverse
      ? projectModelRelationship.primary_model.name
      : projectModelRelationship.related_model.name
  ), [projectModelRelationship]);

  /**
   * Sets the hidden attribute if the relationship's foreign model does not share data.
   */
  const hidden = useMemo(() => (
    projectModelRelationship.inverse
      ? _.isEmpty(projectModelRelationship.primary_model.has_shares)
      : _.isEmpty(projectModelRelationship.related_model.has_shares)
  ), [projectModelRelationship]);

  /**
   * Hide the menu if the related model does not have any shared models.
   */
  if (hidden) {
    return null;
  }

  return (
    <Dropdown.Header
      className={styles.relatedViewMenu}
    >
      <Form.Field
        className={styles.field}
        inline
      >
        <Checkbox
          checked={props.value === Views.all}
          className={styles.checkbox}
          label={t('RelatedViewMenu.labels.all', { name })}
          name='view'
          onChange={() => props.onChange(Views.all)}
          radio
          value={Views.all}
        />
        <Checkbox
          checked={props.value === Views.owned}
          className={styles.checkbox}
          label={t('RelatedViewMenu.labels.owned', { name })}
          name='view'
          onChange={() => props.onChange(Views.owned)}
          radio
          value={Views.owned}
        />
        <Checkbox
          checked={props.value === Views.shared}
          className={styles.checkbox}
          label={t('RelatedViewMenu.labels.shared', { name })}
          name='view'
          onChange={() => props.onChange(Views.shared)}
          radio
          value={Views.shared}
        />
      </Form.Field>
    </Dropdown.Header>
  );
};

export default RelatedViewMenu;
