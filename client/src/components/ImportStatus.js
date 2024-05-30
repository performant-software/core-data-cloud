// @flow

import React from 'react';
import { Label } from 'semantic-ui-react';
import { Status } from '../constants/Import';
import styles from './ImportStatus.module.css';

type Props = {
  status: string
};

const ImportStatus = (props: Props) => {
  if (props.status === Status.new) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='blue'
        content={'New Record'}
        icon='plus'
      />
    );
  }

  if (props.status === Status.noConflict) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        content={'No Conflict'}
        icon='checkmark'
      />
    );
  }

  if (props.status === Status.conflict) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='red'
        content={'Conflict'}
        icon='warning'
      />
    );
  }

  if (props.status === Status.resolved) {
    return (
      <Label
        className={styles.fairCopyImportStatus}
        color='green'
        content={'Resolved'}
        icon='checkmark'
      />
    );
  }

  return null;
};

export default ImportStatus;
