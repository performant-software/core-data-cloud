// @flow

import React, { useMemo } from 'react';
import { Icon, Label, Loader } from 'semantic-ui-react';
import type { JobStatus as JobStatusType } from '../types/Job';
import { getStatusView, JobStatuses } from '../utils/JobStatuses';

type Props = {
  status: JobStatusType
};

const JobStatus = ({ status }: Props) => {
  const content = useMemo(() => getStatusView(status), [status]);

  if (status === JobStatuses.initializing.value) {
    return (
      <Label
        content={content}
        icon='clock'
      />
    );
  }

  if (status === JobStatuses.processing.value) {
    return (
      <Label
        color='yellow'
        content={content}
        icon={(
          <Icon>
            <Loader
              active
              inline
              inverted
              size='tiny'
            />
          </Icon>
        )}
      />
    );
  }

  if (status === JobStatuses.completed.value) {
    return (
      <Label
        color='green'
        content={content}
        icon='check circle'
      />
    );
  }

  if (status === JobStatuses.failed.value) {
    return (
      <Label
        color='red'
        content={content}
        icon='exclamation circle'
      />
    );
  }

  return null;
};

export default JobStatus;