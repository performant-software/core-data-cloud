// @flow

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Container } from 'semantic-ui-react';
import styles from './SaveButton.module.css';

type Props = {
  onClick: () => void,
  saving?: boolean
};

const SaveButton = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Container
      className={cx(styles.saveButton, styles.ui, styles.container)}
      fluid
    >
      <Button
        content={t('Common.buttons.save')}
        disabled={props.saving}
        primary
        onClick={props.onClick}
        size='medium'
        type='submit'
      />
    </Container>
  );
};

export default SaveButton;
