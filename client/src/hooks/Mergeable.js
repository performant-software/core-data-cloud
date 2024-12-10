// @flow

import { BooleanIcon } from '@performant-software/semantic-components';
import { Date as DateUtils, FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import { DataTypes } from '@performant-software/user-defined-fields';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { Label } from 'semantic-ui-react';
import _ from 'underscore';
import styles from './Mergeable.module.css';

const useMergeable = () => {
  /**
   * Renders the user-defined field value for the passed item.
   *
   * @type {(function(*, *, boolean=): (*))|*}
   */
  const renderUserDefined = useCallback((value, field, editable = false, onRemove = null) => {
    if (_.isBoolean(value) && field.data_type === DataTypes.boolean) {
      return (
        <BooleanIcon
          value={value}
        />
      );
    }

    if (field.data_type === DataTypes.date) {
      return value && DateUtils.formatDate(value);
    }

    if (value && field.data_type === DataTypes.fuzzyDate) {
      return FuzzyDateUtils.getDateView(value);
    }

    if (field.data_type === DataTypes.select && field.allow_multiple) {
      return _.map(value, (entry) => (
        <Label
          className={cx(styles.ui, styles.label)}
          content={entry}
          onRemove={editable && onRemove ? onRemove.bind(this, field, entry) : undefined}
        />
      ));
    }

    if (value && field.data_type === DataTypes.richText) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: value
          }}
        />
      );
    }

    return value;
  }, []);

  return {
    renderUserDefined
  };
};

export default useMergeable;
