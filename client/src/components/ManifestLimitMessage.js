// @flow

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarning } from 'react-icons/io5';
import { Icon, Message } from 'semantic-ui-react';
import MediaContentUtils from '../utils/MediaContent';

type Props = {
  count: number
};

const ManifestLimitMessage = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Memo-izes the IIIF manifest item limit.
   *
   * @type {number}
   */
  const limit = useMemo(() => MediaContentUtils.getManifestLimit(), []);

  if (props.count <= limit) {
    return null;
  }

  return (
    <Message
      content={t('ManifestLimitMessage.content', { count: props.count, limit })}
      header={t('ManifestLimitMessage.header')}
      icon={(
        <Icon>
          <IoWarning />
        </Icon>
      )}
      warning
    />
  );
};

export default ManifestLimitMessage;
