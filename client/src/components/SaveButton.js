// @flow

import cx from 'classnames';
import React from 'react';
import { Container } from 'semantic-ui-react';
import { SaveButton as SemanticSaveButton } from '@performant-software/semantic-components';
import styles from './SaveButton.module.css';

type Props = {
  onClick: () => void
};

const SaveButton = (props: Props) => (
  <Container
    className={cx(styles.saveButton, styles.ui, styles.container)}
    fluid
  >
    <SemanticSaveButton
      onClick={props.onClick}
    />
  </Container>
);

export default SaveButton;
