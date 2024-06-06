// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'semantic-ui-react';
import { Status } from '../constants/Import';
import styles from './ImportStatus.module.css';

type Props = {
  count?: number,
  status: string
};

const ImportStatus = (props: Props) => {
  const { t } = useTranslation();

  if (props.status === Status.new) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='blue'
        content={t('ImportStatus.labels.new')}
        detail={props.count}
        icon='plus'
      />
    );
  }

  if (props.status === Status.noConflict) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        content={t('ImportStatus.labels.noConflict')}
        detail={props.count}
        icon='checkmark'
      />
    );
  }

  if (props.status === Status.conflict) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='red'
        content={t('ImportStatus.labels.conflict')}
        detail={props.count}
        icon='warning'
      />
    );
  }

  if (props.status === Status.resolved) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='green'
        content={t('ImportStatus.labels.resolved')}
        detail={props.count}
        icon='checkmark'
      />
    );
  }

  return null;
};

export default ImportStatus;
