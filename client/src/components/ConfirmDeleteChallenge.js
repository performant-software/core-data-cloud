// @flow

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Form,
  Modal
} from 'semantic-ui-react';
import styles from './ConfirmDeleteChallenge.module.css';

type Props = {
  name: string,
  onClose: () => void,
  onConfirm: () => void
};

const ConfirmDeleteChallenge = (props: Props) => {
  const [userInput, setUserInput] = useState('');
  const { t } = useTranslation();

  const onSubmit = () => {
    if (userInput === props.name) {
      props.onConfirm();
    }
  }

  return (
    <Modal
      as={Form}
      centered={false}
      onClose={props.onClose}
      onSubmit={onSubmit}
      open
      size='tiny'
    >
      <Modal.Header
        content={t('ConfirmDeleteChallenge.header')}
      />
      <Modal.Content
        className={styles.confirmDeleteChallengeContent}
      >
        <p>
          { t('ConfirmDeleteChallenge.messages.intro') }
          &nbsp;
          <strong>{ props.name }</strong>
          &nbsp;
          { t('ConfirmDeleteChallenge.messages.toConfirm') }
        </p>
        <Form.Input
          autoFocus
          fluid
          onChange={(e, { value }) => setUserInput(value)}
          value={userInput}
          type='text'
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
          type='button'
        />
        <Button
          color='red'
          content={t('ConfirmDeleteChallenge.buttons.delete')}
          disabled={userInput !== props.name}
          type='submit'
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmDeleteChallenge;
