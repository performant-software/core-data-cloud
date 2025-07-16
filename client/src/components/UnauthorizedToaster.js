// @flow

import { Toaster } from '@performant-software/semantic-components';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';

type Props = {
  content?: string,
  header?: string
};

const UnauthorizedToaster = (props: Props) => {
  const [redirect, setRedirect] = useState(false);

  const location = useLocation();
  const { t } = useTranslation();

  /**
   * Callback fired when the toaster is dismissed.
   *
   * @type {(function(): void)|*}
   */
  const onDismiss = useCallback(() => {
    // Set the redirect attribute to "false" to hide to toaster.
    setRedirect(false);

    // Replace the location state so that the redirect message does not keep getting displayed.
    window.history.replaceState({}, '');
  }, []);

  useEffect(() => {
    if (location.state?.unauthorized) {
      setRedirect(true);
    }
  }, [location.state]);

  if (!redirect) {
    return null;
  }

  return (
    <Toaster
      onDismiss={onDismiss}
      timeout={5000}
      type='negative'
    >
      <Message.Header
        content={props.header || t('UnauthorizedToaster.messages.redirect.header')}
      />
      <Message.Content
        content={props.content || t('UnauthorizedToaster.messages.redirect.content')}
      />
    </Toaster>
  );
};

export default UnauthorizedToaster;
