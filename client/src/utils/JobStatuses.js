// @flow

import _ from 'underscore';
import i18n from '../i18n/i18n';

type JobStatusesType = {
  [key: string]: {
    label: string,
    value: string
  }
};

const JobStatuses: JobStatusesType = {
  initializing: {
    label: i18n.t('JobStatuses.labels.initializing'),
    value: 'initializing'
  },
  processing: {
    label: i18n.t('JobStatuses.labels.processing'),
    value: 'processing'
  },
  completed: {
    label: i18n.t('JobStatuses.labels.completed'),
    value: 'completed'
  },
  failed: {
    label: i18n.t('JobStatuses.labels.failed'),
    value: 'failed'
  }
};

/**
 * Returns the label for the passed role value.
 *
 * @param value
 *
 * @returns {*}
 */
const getStatusView = (value: string): string => {
  const status = _.findWhere(_.values(JobStatuses), { value });
  return status?.label;
};

export {
  getStatusView,
  JobStatuses
};
