// @flow

import cx from 'classnames';
import { ModalContext } from '@performant-software/shared-components';
import React, { useCallback, useContext, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
  Modal
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import styles from './LocalLoginModal.module.css';
import { AuthenticationContext } from '../context/Authentication';

type Props = {
  open: boolean,
};

const LocalLoginModal = (props: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState();
  const [error, setError] = useState(false);
  const [password, setPassword] = useState();

  const { login } = useContext(AuthenticationContext);

  const { t } = useTranslation();

  /**
   * Attempts to authenticate then navigates to the admin page.
   *
   * @type {(function(): void)|*}
   */
  const onLogin = useCallback(() => {
    setDisabled(true);

    login({ email, password })
      .catch(() => setError(true))
      .finally(() => setDisabled(false));
  }, [email, login, password]);

  return (
    <ModalContext.Consumer>
      { (mountNode) => (
        <Modal
          as={Form}
          className={styles.loginModal}
          error={error}
          mountNode={mountNode}
          open={props.open}
          size='small'
        >
          <Header
            icon='user circle'
            content={t('LocalLoginModal.header')}
          />
          <Message
            error
            header={t('LocalLoginModal.loginErrorHeader')}
            content={t('LocalLoginModal.loginErrorContent')}
          />
          <Grid
            className={cx(styles.grid, styles.ui)}
            padded='vertically'
            textAlign='center'
          >
            <Grid.Column className={styles.column}>
              <Grid.Row
                className={styles.row}
              >
                <Input
                  autoFocus
                  className={cx(styles.ui, styles.formField, styles.input)}
                  icon={<Icon name='at' />}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('LocalLoginModal.email')}
                  size='huge'
                />
              </Grid.Row>
              <Grid.Row
                className={styles.row}
              >
                <Input
                  className={cx(styles.ui, styles.formField, styles.input)}
                  icon={<Icon name='lock' />}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('LocalLoginModal.password')}
                  size='huge'
                  type='password'
                />
              </Grid.Row>
              <Grid.Row
                className={styles.row}
              >
                <Button
                  disabled={disabled}
                  fluid
                  onClick={onLogin}
                  primary
                  type='submit'
                >
                  { t('LocalLoginModal.buttonLogin') }
                </Button>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Modal>
      )}
    </ModalContext.Consumer>
  );
};

export default LocalLoginModal;
