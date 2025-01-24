// @flow

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
import './LoginModal.css';

type Props = {
  disabled: boolean,
  loginFailed: boolean,
  onClose: () => void,
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
          className='login-modal'
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
            padded='vertically'
            textAlign='center'
          >
            <Grid.Column>
              <Grid.Row className='sso-row'>
                <Button
                  onClick={props.onSSO.bind(this)}
                  secondary
                  size='medium'
                  type='button'
                >
                  {t('LoginModal.logInWithSso')}
                </Button>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Input
                  autoFocus
                  className='form-field'
                  icon={<Icon name='at' />}
                  onChange={props.onUsernameChange.bind(this)}
                  placeholder={props.placeholder}
                  size='huge'
                />
              </Grid.Row>
              <Grid.Row
                className='row'
              >
                <Input
                  className='form-field'
                  icon={<Icon name='lock' />}
                  onChange={props.onPasswordChange.bind(this)}
                  placeholder={t('LoginModal.password')}
                  size='huge'
                  type='password'
                />
              </Grid.Row>
            </Grid.Column>
          </Grid>
          <Modal.Actions>
            <Button
              disabled={props.disabled}
              onClick={props.onLogin.bind(this)}
              primary
              size='large'
              type='submit'
            >
              { t('LoginModal.buttonLogin') }
            </Button>
            { props.onClose && (
              <Button
                basic
                onClick={props.onClose.bind(this)}
                size='large'
              >
                { t('LoginModal.buttonCancel') }
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      )}
    </ModalContext.Consumer>
  );
};

export default LoginModal;
