// @flow

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';

type Props = {
  multiple: boolean
};

const MediaUploadingMessage = (props: Props) => {
  const [visible, setVisible] = useState(true);

  const { t } = useTranslation();

  const content = useMemo(() => (props.multiple
    ? t('MediaUploadingMessage.messages.multiple.content')
    : t('MediaUploadingMessage.messages.single.content')), [props.multiple]);

  const header = useMemo(() => (props.multiple
    ? t('MediaUploadingMessage.messages.multiple.header')
    : t('MediaUploadingMessage.messages.single.header')), [props.multiple]);

  return (
    <Message
      content={content}
      header={header}
      hidden={!visible}
      icon='cloud upload'
      info
      onDismiss={() => setVisible(false)}
    />
  );
};

export default MediaUploadingMessage;
