// @flow

import cx from 'classnames';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IoWarning } from 'react-icons/io5';
import { Icon, Popup } from 'semantic-ui-react';
import MediaContentUtils from '../utils/MediaContent';
import styles from './ManifestLimitIcon.module.css';

const ManifestLimitIcon = () => {
  const { t } = useTranslation();

  /**
   * Memo-izes the IIIF manifest item limit.
   *
   * @type {number}
   */
  const limit = useMemo(() => MediaContentUtils.getManifestLimit(), []);

  if (!limit) {
    return null;
  }

  return (
    <Popup
      content={t('ManifestLimitIcon.labels.limit', { limit })}
      trigger={(
        <Icon
          className={cx(styles.manifestLimitIcon, styles.icon)}
        >
          <IoWarning
            size='2em'
          />
        </Icon>
      )}
    />
  );
};

export default ManifestLimitIcon;
