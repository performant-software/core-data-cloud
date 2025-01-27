// @flow

import cx from 'classnames';
import { ModalContext } from '@performant-software/shared-components';
import React, { type Element } from 'react';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
  Modal
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import styles from './LoginModal.module.css';

type Props = {
  disabled: boolean,
  loginFailed: boolean,
  onLogin: () => void,
  onPasswordChange: () => void,
  onSSO: () => void,
  onUsernameChange: () => void,
  open: boolean,
  trigger?: () => Element<any>,
  placeholder: string
};

const LoginModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <ModalContext.Consumer>
      { (mountNode) => (
        <Modal
          as={Form}
          className={styles.loginModal}
          error={props.loginFailed}
          mountNode={mountNode}
          open={props.open}
          size='small'
          trigger={props.trigger}
        >
          <Header
            icon='user circle'
            content={t('LoginModal.header')}
          />
          <Message
            error
            header={t('LoginModal.loginErrorHeader')}
            content={t('LoginModal.loginErrorContent')}
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
                  onChange={props.onUsernameChange.bind(this)}
                  placeholder={props.placeholder}
                  size='huge'
                />
              </Grid.Row>
              <Grid.Row
                className={styles.row}
              >
                <Input
                  className={cx(styles.ui, styles.formField, styles.input)}
                  icon={<Icon name='lock' />}
                  onChange={props.onPasswordChange.bind(this)}
                  placeholder={t('LoginModal.password')}
                  size='huge'
                  type='password'
                />
              </Grid.Row>
              <Grid.Row
                className={styles.row}
              >
                <Button
                  disabled={props.disabled}
                  fluid
                  onClick={props.onLogin.bind(this)}
                  primary
                  type='submit'
                >
                  { t('LoginModal.buttonLogin') }
                </Button>
              </Grid.Row>
              <Divider horizontal>
                {t('Common.words.or')}
              </Divider>
              <Grid.Row
                className={cx(styles.row, styles.ssoRow)}
              >
                <Button
                  fluid
                  onClick={props.onSSO.bind(this)}
                  secondary
                  type='button'
                >
                  {t('LoginModal.logInWithSso')}
                </Button>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Modal>
      )}
    </ModalContext.Consumer>
  );
};

export default LoginModal;
