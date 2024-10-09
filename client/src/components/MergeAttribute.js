// @flow

import cx from 'classnames';
import React, { type Element } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';
import _ from 'underscore';
import styles from './MergeAttribute.module.css';

type Props = {
  button?: ButtonProps,
  buttonPosition?: 'left' | 'right',
  className?: string,
  value: Element | string
};

const MergeAttribute = (props: Props) => {
  // Return null if the value is empty
  if (_.isEmpty(props.value) && !_.isNumber(props.value) && !_.isBoolean(props.value)) {
    return null;
  }

  return (
    <div
      className={cx(styles.mergeAttribute, props.className)}
    >
      { !_.isEmpty(props.button) && props.buttonPosition === 'left' && (
        <Button
          {...props.button}
        />
      )}
      <div
        className={styles.content}
      >
        { props.value }
      </div>
      { !_.isEmpty(props.button) && props.buttonPosition === 'right' && (
        <Button
          {...props.button}
        />
      )}
    </div>
  );
};

export default MergeAttribute;
